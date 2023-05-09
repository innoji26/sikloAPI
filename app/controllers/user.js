const db = require("../models");
const User = db.user;
const News = db.news;
const fs = require("fs");

// Retrieve all Users from the database.
exports.getAllUser = (req, res) => {
    User.findAll()
        .then((data) => {
            res.send({
                error: false,
                message: "Success",
                user: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

// Find a single User with an id
exports.getUserById = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    error: true,
                    message: "Not found User with id " + id,
                });
            } else {
                res.send({
                    error: false,
                    message: "Success",
                    user: data,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: "Error retrieving User with id=" + id,
            });
        });
};

// Update a User by the id in the request
exports.updateUserById = (req, res) => {
    const id = req.params.id;
    const avatar = req.file ? req.file.filename : User.avatar;
    const name = req.body.name;

    User.findOne({
        where: {
            id: id,
        },
    }).then((user) => {
        if (!user) {
            res.status(404).send({
                error: true,
                message: "Not found User with id " + id,
            });
        }else{
            if (user.avatar !== "default.png") {
            if (user.avatar !== user.avatar) {
                const directoryPath = __dirname + "/../public/uploads/" + user.avatar;
                fs.unlink(directoryPath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }
        }
        User.update({ avatar: avatar, name: name }, {
                where: { id: id },
            })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        error: false,
                        message: "User was updated successfully.",
                    });
                } else {
                    res.send({
                        error: true,
                        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    error: true,
                    message: "Error updating User with id=" + id,
                });
            });
        }
        
    });
};

// Delete a User with the specified id in the request
exports.deleteUserById = (req, res) => {
    const id = req.params.id;

    User.findOne({
        where: {
            id: id,
        },
        include: ["news"],
    }).then((user) => {
        User.destroy({
                where: { id: id },
            })
            .then((num) => {
                if (num == 1) {
                    if (user.avatar !== "default.png") {
                        const directoryPath =
                            __dirname + "/../public/uploads/" + user.avatar;
                        fs.unlink(directoryPath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                    res.send({
                        error: false,
                        message: "User was deleted successfully!",
                    });
                } else {
                    res.send({
                        error: true,
                        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    error: true,
                    message: "Could not delete User with id=" + id,
                });
            });
    });
};
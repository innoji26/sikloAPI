const db = require("../models");
const News = db.news;
const fs = require("fs");
const nanoid = require("nanoid");
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new News
exports.addNews = (req, res) => {
    // Create a News
    const news = {
        id: req.body.id ? req.body.id : "news_" + nanoid.nanoid(15),
        title: req.body.title,
        description: req.body.description,
        image: req.file ? req.file.filename : null,
        idUser: req.body.idUser,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Validate request
    if (!news.title) {
        res.status(400).send({
            error: true,
            message: "Title can not be empty!",
        });
        return;
    }

    if (!news.description) {
        res.status(400).send({
            error: true,
            message: "description can not be empty!",
        });
        return;
    }

    if (!news.image) {
        res.status(400).send({
            error: true,
            message: "Image can not be empty!",
        });
        return;
    }

    // Save News in the database
    News.create(news)
        .then((data) => {
            res.send({
                error: false,
                message: "Success",
                news: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message || "Some error occurred while creating the News.",
            });
        });
};

// Retrieve all News from the database.
exports.getAllNews = (req, res) => {
    News.findAll({
            order: [
                ["createdAt", "DESC"]
            ],
        })
        .then((data) => {
            res.send({
                error: false,
                message: "Success",
                news: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message || "Some error occurred while retrieving news.",
            });
        });
};

exports.getNewsById = (req, res) => {
    const id = req.params.id;

    News.findOne({
            where: {
                id: id,
            },
            include: [{
                model: User,
                as: "user",
                attributes: {
                    exclude: ["password"],
                },
            }, ],
        })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    error: true,
                    message: "Not found News with id " + id,
                });
            } else {
                res.send({
                    error: false,
                    message: "Success",
                    news: data,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: "Error retrieving News with id=" + id,
            });
        });
};

exports.updateNewsById = (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file ? req.file.filename : News.image;
    

    News.findOne({
        where: {
            id: id,
        },
    }).then((news) => {
        if (!news) {
            res.status(404).send({
                error: true,
                message: "Not found News with id " + id,
            });
        } else {
            if (news.image !== news.image) {
                const directoryPath = __dirname + "/../public/uploads/" + news.image;
                fs.unlink(directoryPath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }
            News.update({
                    title: title,
                    description: description,
                    image: image,
                    updatedAt: new Date(),
                }, {
                    where: {
                        id: id,
                    },
                })
                .then((num) => {
                    if (num == 1) {
                        res.send({
                            error: false,
                            message: "News was updated successfully.",
                        });
                    } else {
                        res.send({
                            error: true,
                            message: `Cannot update News with id=${id}. Maybe News was not found or req.body is empty!`,
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        error: true,
                        message: "Error updating News with id=" + id,
                    });
                });
        }
    });
};

exports.deleteNewsById = (req, res) => {
    const id = req.params.id;

    News.findOne({
        where: {
            id: id,
        },
    }).then((news) => {
        News.destroy({
            where: {
                id: id,
            },
        }).then((num) => {
            if (num == 1) {
                const directoryPath = __dirname + "/../public/uploads/" + news.image;
                fs.unlink(directoryPath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
                res.send({
                    error: false,
                    message: "News was deleted successfully!",
                });
            } else {
                res.send({
                    error: true,
                    message: `Cannot delete News with id=${id}. Maybe News was not found!`,
                });
            }
        });
    });
};

exports.getAllNewsByUser = (req, res) => {
    News.findAll({
            include: ["user"],
        })
        .then((data) => {
            res.send({
                error: false,
                message: "Success",
                news: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message || "Some error occurred while retrieving news.",
            });
        });
};

exports.searchNewsByTitle = (req, res) => {
    const title = req.query.title;
    const condition = title ?
        {
            title: {
                [Op.like]: `%${title}%`,
            },
        } :
        null;

    News.findAll({
            where: condition,
        })
        .then((data) => {
            if (data.length === 0) {
                res.status(404).send({
                    error: true,
                    message: "Not found News with title " + title,
                });
            } else {
                res.send({
                    error: false,
                    message: "Success",
                    news: data,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message || "Some error occurred while retrieving news.",
            });
        });
};
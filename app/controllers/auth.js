const db = require("../models");
const User = db.user;
const nanoid = require("nanoid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/authConfig.js");
const op = db.Sequelize.Op;

exports.register = (req, res) => {
    // Create a User
    const user = {
        id: req.body.id ? req.body.id : "user_" + nanoid.nanoid(15),
        name: req.body.name,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        email: req.body.email,
        role: req.body.role ? req.body.role : "user",
        avatar: req.file ? req.file.filename : "default.png",
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            error: true,
            message: "Name can not be empty!",
        });
        return;
    }

    if (!req.body.username) {
        res.status(400).send({
            error: true,
            message: "Username can not be empty!",
        });
        return;
    }

    if (req.body.username.length < 6) {
        res.status(400).send({
            error: true,
            message: "Username must be at least 6 characters!",
        });
        return;
    }

    if (req.body.email && !validateEmail(req.body.email)) {
        res.status(400).send({
            error: true,
            message: "Email is not valid!",
        });
        return;
    }

    if (!req.body.password) {
        res.status(400).send({
            error: true,
            message: "Password can not be empty!",
        });
        return;
    }

    if (!req.body.email) {
        res.status(400).send({
            error: true,
            message: "Email can not be empty!",
        });
        return;
    }

    // Save User in the database
    User.create(user)
        .then((data) => {
            res.send({
                error: false,
                message: "Success create usser",
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message,
            });
        });
};

exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const condition = username ?
        {
            username: {
                [op.eq]: `${username}`,
            },
        } :
        {
            email: {
                [op.eq]: `${email}`,
            },
        };

    if (!username && !email) {
        res.status(400).send({
            error: true,
            message: "Username or email can not be empty!",
        });
        return;
    }

    if (!password) {
        res.status(400).send({
            error: true,
            message: "Password can not be empty!",
        });
        return;
    }

    User.findOne({
            where: {
                [op.or]: condition,
            },
        })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    error: true,
                    message: "User Not found.",
                });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    error: true,
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }

            const token = jwt.sign({
                    username: user.username,
                },
                authConfig.secretKey, {
                    expiresIn: 86400, // 24 hours
                }
            );

            req.session.token = token;

            res.status(200).send({
                error: false,
                message: "Success login",
                loginResult: {
                    userId: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    accessToken: token,
                },
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: true,
                message: err.message,
            });
        });
};

exports.logout = (req, res) => {
    req.session = null;
    res.send({
        error: false,
        message: "Success logout",
    });
};
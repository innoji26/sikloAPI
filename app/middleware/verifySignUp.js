const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username ? req.body.username : null,
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                error: true,
                message: "Failed! Username is already in use!",
            });
            return;
        }

        User.findOne({
            where: {
                email: req.body.email ? req.body.email : null,
            },
        }).then((user) => {
            if (user) {
                res.status(401).send({
                    error: true,
                    message: "Failed! Email is already in use!",
                });
                return;
            }

            next();
        });
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
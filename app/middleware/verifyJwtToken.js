const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token;

    try {
        token = req.headers["authorization"].split(" ")[1];
    } catch (error) {
        return res.status(403).send({
            error: true,
            message: "No token provided!",
        });
    }

    if (!token) {
        return res.status(403).send({
            error: true,
            message: "No token provided!",
        });
    }

    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                error: true,
                message: "Unauthorized!",
            });
        }
        req.username = decoded.username;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
};

module.exports = authJwt;
module.exports = (app) => {
    const user = require("../controllers/user.js");
    const { authJwt } = require("../middleware");
    const uploadFile = require("../middleware/upload");

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    // Retrieve all Users
    app.get("/api/user/", [authJwt.verifyToken], user.getAllUser);

    app.get("/api/user/:id", [authJwt.verifyToken], user.getUserById);

    app.put(
        "/api/user/:id", [authJwt.verifyToken, uploadFile.single("avatar")],
        user.updateUserById
    );

    app.delete("/api/user/:id", [authJwt.verifyToken], user.deleteUserById);
};
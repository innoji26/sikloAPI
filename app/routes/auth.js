module.exports = (app) => {
    const user = require("../controllers/auth.js");
    const { verifySignUp } = require("../middleware");
    const uploadFile = require("../middleware/upload");

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    // register
    app.post(
        "/api/auth/signup/", [uploadFile.single("avatar"), verifySignUp.checkDuplicateUsernameOrEmail],
        user.register
    );

    //login
    app.post("/api/auth/signin/", user.login);

    //logout
    app.post("/api/auth/logout/", user.logout);
};
const { application } = require("express");

module.exports = (app) => {
    const news = require("../controllers/news.js");
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
    app.get("/api/news/", [authJwt.verifyToken], news.getAllNews);

    app.get("/api/news/:id", [authJwt.verifyToken], news.getNewsById);

    app.post(
        "/api/news/", [authJwt.verifyToken, uploadFile.single("image")],
        news.addNews
    );

    app.put(
        "/api/news/:id", [authJwt.verifyToken, uploadFile.single("image")],
        news.updateNewsById
    );

    app.delete("/api/news/:id", [authJwt.verifyToken], news.deleteNewsById);

    app.get("/news", [authJwt.verifyToken], news.getAllNewsByUser);
    
    app.get("/news/search", [authJwt.verifyToken], news.searchNewsByTitle);
};
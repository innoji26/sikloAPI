const verifySignUp = require("./verifySignUp");
const authJwt = require("./verifyJwtToken");
const uploadFile = require("./upload");

module.exports = {
    verifySignUp,
    authJwt,
    uploadFile,
};
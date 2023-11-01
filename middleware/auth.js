const jwt = require("jsonwebtoken");
const { failureResponse } = require("../utils/response");
const { verifySecretToken } = require("../utils/auth");
const User = require("../models/user");

const userAuthenticated = async (req, res, next) => {
    // only allow access to route if user is authenticated
    const token =
        req.header("Authorization") &&
        req.header("Authorization").split(" ")[1];
    if (!token) return failureResponse(res, 401, "Unauthorized: Token missing");

    // check if token valid
    const decoded = verifySecretToken(token);
    if (decoded) {
        req.user = await User.findById({ _id: decoded.id });
        next();
    } else {
        return failureResponse(res, 401, "Unauthorized: Token invalid");
    }
};

module.exports = {
    userAuthenticated,
};

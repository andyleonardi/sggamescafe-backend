const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { tokenSecret, tokenExpiry, saltRounds } = require("../config/auth");

const createSecretToken = (userid) => {
    // generates a jwt
    return jwt.sign({ id: userid }, tokenSecret, process.env.TOKEN_KEY, {
        expiresIn: tokenExpiry,
    });
};

const verifySecretToken = (token) => {
    // verify the token
    return jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) return false;
        return decoded;
    });
};

const getEncryptedPassword = (password) => {
    // get the encrypted password
    return bcrypt.hashSync(password, saltRounds);
};

const comparePassword = (data, encrypted) => {
    // compare the password
    return bcrypt.compareSync(data, encrypted);
};

module.exports = {
    createSecretToken,
    verifySecretToken,
    getEncryptedPassword,
    comparePassword,
};

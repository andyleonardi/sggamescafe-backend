// Configurations required for the authentication
require("dotenv").config();

const saltRounds = process.env.SALT_ROUNDS || 8;
const tokenSecret = process.env.TOKEN_SECRET;
const tokenExpiry = process.env.TOKEN_EXPIRY || "10m";

module.exports = {
  saltRounds,
  tokenSecret,
  tokenExpiry,
};

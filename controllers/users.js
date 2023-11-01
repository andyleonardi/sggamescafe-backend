const {
  createSecretToken,
  getEncryptedPassword,
  comparePassword,
} = require("../utils/auth");
const { failureResponse, successResponse } = require("../utils/response");
const User = require("../models/user");

const getUser = async (req, res) => {
  const ldap = req.params.ldap;

  try {
    const user = await User.findOne({ ldap: ldap });
    if (!user) {
      // failure if user does not exists
      return failureResponse(res, 400, "Error accessing user");
    }
    return successResponse(res, 200, "Successfully retrieved user", {
      user: user,
    });
  } catch (err) {
    console.error(err);
    return failureResponse(res, 500, "Internal server error");
  }
};

const loginUser = async (req, res, next) => {
  // login with ldap + password
  try {
    const { ldap, password } = req.body;
    if (!ldap || !password) {
      return failureResponse(res, 400, "All fields required");
    }

    const user = await User.findOne({ ldap: ldap });
    if (!user) {
      return failureResponse(res, 400, "Incorrect password or ldap");
    }
    const auth = comparePassword(password, user.password);
    if (!auth) {
      return failureResponse(res, 400, "Incorrect password or ldap");
    }

    const token = createSecretToken(user._id);

    return successResponse(res, 201, "User logged in successfully", {
      token: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, "Internal server error");
  }
};

const createUser = async (req, res, next) => {
  // create a new user
  try {
    const { ldap, password } = req.body;

    if (!ldap || !password) {
      // check that all inputs are provided
      return failureResponse(res, 400, "Missing required details");
    }

    const existingUser = await User.findOne({ ldap: ldap });
    if (existingUser) {
      // check that user does not already exists
      return failureResponse(res, 400, "User already exists");
    }

    const user = await User.create({
      ldap: ldap,
      password: getEncryptedPassword(password),
    });

    return successResponse(res, 201, "User created successfully", {
      user: user,
    });
  } catch (err) {
    console.error(err);
    return failureResponse(res, 500, "Internal server error");
  }
};

const deleteUser = async (req, res) => {
  const ldap = req.params.ldap;

  try {
    const user = await User.findOneAndDelete({ ldap: ldap });
    if (!user) {
      return failureResponse(res, 400, "Error deleting user");
    }

    return successResponse(res, 201, "Successfully deleted user");
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, err.message);
  }
};

const editPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return failureResponse(res, 400, "Current and new passwords required");
    }

    const user = await User.findOne({ ldap: req.params.ldap });
    if (!user) {
      return failureResponse(res, 400, "Error changing password");
    }

    if (!comparePassword(currentPassword, user.password)) {
      return failureResponse(res, 400, "Error changing password");
    }
    await User.findOneAndUpdate(
      { ldap: req.params.ldap },
      { password: getEncryptedPassword(newPassword) },
      { new: true }
    );

    return successResponse(res, 200, "Successfully changed password");
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, err.message);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  deleteUser,
  editPassword,
};

const express = require("express");
const router = express.Router();
const { userAuthenticated } = require("../middleware/auth");
const usersCtrl = require("../controllers/users");

// POST - login user
router.post("/login", usersCtrl.loginUser);

// CREATE a user
router.post("/new", usersCtrl.createUser);

// GET a user
router.get("/:ldap", userAuthenticated, usersCtrl.getUser);

// DELETE a user
router.delete("/:ldap", userAuthenticated, usersCtrl.deleteUser);

// EDIT a user details
router.put("/:ldap", userAuthenticated, usersCtrl.editPassword);

module.exports = router;

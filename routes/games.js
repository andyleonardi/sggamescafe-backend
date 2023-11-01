const express = require("express");
const router = express.Router();
const { userAuthenticated } = require("../middleware/auth");
const gamesCtrl = require("../controllers/games");


// -----------------------------------------------------------------------------
// ADMIN ROUTES
// -----------------------------------------------------------------------------
// TODO change when authentication is done
/* CREATE add new game */
// router.post("/new", userAuthenticated, gamesCtrl.create);
router.post("/new", userAuthenticated, gamesCtrl.create);

// /* EDIT a game's details */
// router.put("/:id", userAuthenticated, gamesCtrl.editItem);
router.put("/:id", userAuthenticated, gamesCtrl.editGame);

/* DELETE a game */
// router.delete("/:id", userAuthenticated, gamesCtrl.delete);
router.delete("/:id", userAuthenticated, gamesCtrl.delete);

// -----------------------------------------------------------------------------
// ALL ROUTES
// -----------------------------------------------------------------------------
// GET all games
router.get("/", gamesCtrl.index);

/* GET details of one game */
router.get("/:id", gamesCtrl.showOne);

// /* EDIT a game's details - add user checkout  */
router.put("/:id/check", gamesCtrl.addCheckout);

// /* EDIT a game's details - add user return  */
router.put("/:id/return", gamesCtrl.addUserReturn);


module.exports = router;

const { failureResponse, successResponse } = require("../utils/response");

const bggFetchFunctions = require("../controllers/bggFetch");

// const User = require("../models/user");
const Game = require("../models/game");

module.exports = {
  index,
  showOne,
  create,
  editGame,
  delete: deleteGame,
  addCheckout,
  addUserReturn,
};

async function index(req, res) {
  const games = await Game.find({});
  return successResponse(res, 200, "Successfully retrieved all games", {
    games: games,
  });
  //   res.json({ title: "All items listed in app", items });
}

async function showOne(req, res) {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      // failure if listing does not exists
      return failureResponse(res, 400, "Error, game not found");
    }
    return successResponse(res, 200, "Successfully retrieved game details", {
      game: game,
    });
  } catch (err) {
    console.error(err);
    return failureResponse(res, 500, "Internal server error");
  }
}

async function create(req, res) {
  // Request body should contain:
  // { name, bggThingId, status, type }
  // name & bggThingId should be pre-populated when user add the game through search
  // status & type needs to be inputted by user

  try {
    const {
      name,
      bggThingId,
      //   bggImgUrl,
      //   bggImgThumb,
      status,
      type,
      //   minPlayer,
      //   maxPlayer,
      //   minPlaytime,
      //   maxPlaytime,
    } = req.body;

    if (!type || !status) {
      return failureResponse(
        res,
        400,
        "Please include category and current status"
      );
    }

    const thingDetails = await bggFetchFunctions.getThingDetails(bggThingId);
    const cleanDetails = bggFetchFunctions.cleanOneThingDetails(thingDetails);

    const game = await Game.create({
      name: name,
      bggThingId: bggThingId,
      bggImgUrl: cleanDetails.bggImgUrl,
      bggImgThumb: cleanDetails.bggImgThumb,
      status: status,
      type: type,
      weight: cleanDetails.weight,
      minPlayer: cleanDetails.minPlayer,
      maxPlayer: cleanDetails.maxPlayer,
      minPlaytime: cleanDetails.minPlayTime,
      maxPlaytime: cleanDetails.maxPlayTime,
      checkouts: [],
      reviews: [],
    });

    return successResponse(res, 201, "Game added to the library", {
      game: game,
    });
  } catch (err) {
    console.error(err);
    return failureResponse(res, 500, "Internal server error");
  }
}

async function editGame(req, res) {
  try {
    // Request body should contain:
    // { status, type }

    const updateData = req.body;

    const game = await Game.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: updateData.status,
        type: updateData.type,
      },
      { new: true }
    );

    if (!game) {
      return failureResponse(res, 404, "Game not found");
    }
    return successResponse(res, 201, "Game details updated successfully", {
      game: game,
    });
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, "Internal server error");
  }
}

async function deleteGame(req, res) {
  try {
    const game = await Game.findOneAndDelete(req.params.id);
    return successResponse(res, 201, "Game deleted from library", {
      game: game,
    });
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, err.message);
  }
}

async function addCheckout(req, res) {
  try {
    // const { status, checkout } = req.body;
    // status = "Available" / "Borrowed"
    // checkout = { ldap: "abc", checkoutType: "Borrow" / "Play", checkDate: date, returnDate: null if Borrow, same date if Play}
    const statusUpdate = req.body.status;
    const newCheckout = req.body.checkout;

    console.log("this is the new checkout", newCheckout);

    // First update the status
    const game = await Game.findOneAndUpdate(
      { _id: req.params.id },
      { status: statusUpdate },
      { new: true }
    );
    // Then push the new checkout to checkouts
    game.checkouts.push(newCheckout);
    await game.save();

    return successResponse(res, 201, "New game checkout added", {
      game: game,
    });
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, "Internal server error");
  }
}

async function addUserReturn(req, res) {
  try {
    // const { status, ldap, returnDate, recommended } = req.body;
    // status = "Available"
    // ldap: "abc"
    const statusUpdate = req.body.status;
    const ldapBorrower = req.body.ldap;
    const returnDate = req.body.returnDate;
    const newReview = {
      ldap: req.body.ldap,
      recommended: req.body.recommended,
    };

    // TODO condition if game is not currently borrowed in the first place
    // TODO condition if ldap is not matching with most recent borrower
    
    // First update the status
    const game = await Game.findOneAndUpdate(
      { _id: req.params.id },
      { status: statusUpdate },
      { new: true }
    );
    // Then find the username who checked out the game, with null returnDate
    const checkIndex = game.checkouts.findIndex((c) => c.ldap === ldapBorrower && c.returnDate === null);
    console.log("index of changed checkout", checkIndex);
    game.checkouts[checkIndex].returnDate = returnDate;
    await game.save();
    // Then, if recommended is not null, push review to reviews array
    if (req.body.recommended) {
      game.reviews.push(newReview);
      await game.save();
    }

    return successResponse(res, 201, "Game returned", {
      game: game,
    });
  } catch (err) {
    console.log(err);
    return failureResponse(res, 500, "Internal server error");
  }
}

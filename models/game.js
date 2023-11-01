const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkoutSchema = new Schema(
  {
    ldap: { type: String },
    checkoutType: { type: String, enum: ["Borrow", "Play"] },
    checkDate: { type: Date, default: new Date() },
    returnDate: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const reviewSchema = new Schema(
  {
    ldap: { type: String },
    recommended: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const gameSchema = new Schema(
  {
    name: { type: String },
    bggThingId: { type: String },
    bggImgUrl: { type: String },
    bggImgThumb: { type: String },
    status: {
      type: String,
      enum: ["Available", "Borrowed", "Removed"],
    },
    type: {
      type: String,
      enum: [
        "Two Player",
        "Light",
        "Next Step",
        "Heavy",
        "Abstract",
        "Escape Games",
        "Co-op",
        "Party",
        "Small Games",
      ],
    },
    minPlayer: { type: String },
    maxPlayer: { type: String },
    minPlaytime: { type: String },
    maxPlaytime: { type: String },
    checkouts: [checkoutSchema],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Compile the schema into a model and export it
module.exports = mongoose.model("Game", gameSchema);

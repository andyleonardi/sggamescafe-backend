const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.GAMES_DB);

const db = mongoose.connection;

db.on("connected", function () {
    console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});

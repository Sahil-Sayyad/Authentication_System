// import required package
const mongoose = require("mongoose");

const mongoDBurl = process.env.MONGO_URL;

mongoose
  .connect(mongoDBurl)
  .then(() => console.log("MongoDB connected to db "))
  .catch((err) => console.log("Connection error in mongodb", err));

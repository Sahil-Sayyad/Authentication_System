// import required package
const mongoose = require("mongoose");

const mongoDBurl =
  "mongodb+srv://igsahilsayyad:9325@auth.pze9l9o.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoDBurl)
  .then(() => console.log("MongoDB connected to db "))
  .catch((err) => console.log("Connection error in mongodb", err));

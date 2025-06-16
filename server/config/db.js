require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Db Connected");
  })
  .catch((err) => console.log("DB Error:", err));

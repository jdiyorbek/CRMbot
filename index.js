require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

require("./bot/bot");

async function dev() {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to Database"))
      .catch((error) => console.log(error));

    app.listen(process.env.PORT, () => {
      console.log("Server has been started");
    });
  } catch (error) {
    console.log(error);
  }
}

dev();

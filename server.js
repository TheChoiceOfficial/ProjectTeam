const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/theChoice";
const cors = require("cors");

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongodb is running..."))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, console.log("server is running..."));
app.use("/api/auth", require("./auth"));
app.use("/api/product", require("./product"));

const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  heard: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  category2: {
    type: String,
    require: true,
  },
  red: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
  txt: {
    type: String,
    require: true,
  },
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;

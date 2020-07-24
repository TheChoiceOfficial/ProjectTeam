const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  number: {
    type: Number,
  },
  category: {
    type: String,
    require: true,
  },
  view: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  episodes: {
    details: {
      type: String,
      require: true,
    },
    story: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
  },
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;

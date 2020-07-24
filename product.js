const express = require("express");
const router = express.Router();
const Product = require("./models/Product");

router.get("/getProduct", (req, res) => {
  Product.find = req.body;
  res.json(body);
});
router.post("/addProduct", (req, res) => {
  const {
    title,
    description,
    author,
    image,
    category,
    episodes: { details, story, price },
  } = req.body;
  const newProduct = new Product({
    title,
    description,
    author,
    category,
    image,
    episodes: { details, story, price },
  });
  newProduct
    .save()
    .then((product) => {
      res.send(product);
    })
    .catch((err) => console.log(err));
});
module.exports = router;

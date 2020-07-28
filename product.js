const express = require("express");
const router = express.Router();
const Product = require("./models/Product");

router.get("/getnewproduct", async (req, res) => {
  let result = await Product.find().limit(5).sort({_id:-1})
  res.json(result);
});
router.post("/addnovel", (req, res) => {
  const { title, heard, category, category2, red, detail, txt } = req.body;
  const newProduct = new Product({
    title,
    heard,
    category,
    category2,
    red,
    detail,
    txt,
  });
  newProduct
    .save()
    .then((product) => {
      res.send(product);
    })
    .catch((err) => console.log(err));
});
module.exports = router;

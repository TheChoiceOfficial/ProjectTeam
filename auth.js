const express = require("express");
const router = express.Router();
const User = require("./models/User");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    res.json({ message: "มี Email นี้ในระบบแล้ว" });
  } else {
    const user = await User.findOne({ name: name });
    if (user) {
      res.json({ message: "มี Username นี้ในระบบแล้ว" });
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.send(user._id);
            })
            .catch((err) => console.log(err));
        })
      );
    }
  }
});

module.exports = router;

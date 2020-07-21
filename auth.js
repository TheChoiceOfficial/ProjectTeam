const express = require("express");
const router = express.Router();
const User = require("./models/User");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json({ message: "มี Email นี้ในระบบแล้ว" });
    } else {
      User.findOne({ name: name }).then((user) => {
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
                  res.send(["สมัคสมาชิกสำเร็จแล้ว", user]);
                })
                .catch((err) => console.log(err));
            })
          );
        }
      });
    }
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("./models/User");
const bcrypt = require("bcryptjs");

//!---------------------------------------------------------------------------------------
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json({ message: "มี Email นี้ในระบบแล้ว" });
    } else {
      User.findOne({ username: username }).then((user) => {
        if (user) {
          res.json({ message: "มี Username นี้ในระบบแล้ว" });
        } else {
          const newUser = new User({
            username,
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
                  res.json({ message: "สมัคสมาชิกสำเร็จแล้ว" });
                })
                .catch((err) => console.log(err));
            })
          );
        }
      });
    }
  });
});
//!----------------------------------------------------------------------------------------

const jwt = require("jwt-simple");
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: "MY_SECRET_KEY", //SECRETเดียวกับตอนencode
};

const loginMiddleware = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username, password: password }).then((user) => {
    if (user) next();
    else res.send("username หรือ password ไม่ถูกต้อง");
  });

  //ถ้า username password ไม่ตรงให้ส่งว่า Wrong username and password
};

router.post("/login", loginMiddleware, (req, res) => {
  const payload = {
    sub: req.body.username,
    iat: new Date().getTime(), //มาจากคำว่า issued at time (สร้างเมื่อ)
  };
  const SECRET = "MY_SECRET_KEY"; //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
  res.send(jwt.encode(payload, SECRET));
});

const jwtAuth = new JwtStrategy(jwtOptions, (req, payload, done) => {
  const { username } = req.body;
  User.findOne({ username: username });
  if (payload.sub === "kennaruk") done(null, true);
  else done(null, false);
});
const passport = require("passport");
passport.use(jwtAuth);
const requireJWTAuth = passport.authenticate("jwt", { session: false });

router.get("/", requireJWTAuth, (req, res) => {
  res.send("ยอดเงินคงเหลือ 50");
});

module.exports = router;

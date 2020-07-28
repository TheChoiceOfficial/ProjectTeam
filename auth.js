const express = require("express");
const router = express.Router();
const User = require("./models/User");
const bcrypt = require("bcryptjs");

//!---------------------------------------------------------------------------------------
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
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

const loginMiddleware = async (req, res, next) => {
  const { name, password } = req.body;
  let result = await User.findOne({ name: name })
  if (result != null) {
    if (bcrypt.compareSync(password, result.password)) {
      next();
    } else {
      res.json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
  } else res.send("username ไม่ถูกต้อง");
};
//!---------------------สร้าง jwt ให้ client---------------------------
router.post("/login", loginMiddleware, (req, res) => {
  const payload = {
    sub: req.body.name,
    iat: new Date().getTime(),
  };
  //console.log(payload);
  const SECRET = "MY_SECRET_KEY";
  res.send(jwt.encode(payload, SECRET));
});
//!------------------------------------------------------------------
const jwtAuth = new JwtStrategy(jwtOptions, (req, payload, done) => {
  const { name } = req.body;
  User.findOne({ name: name });
  if (payload.sub === name) done(null, true);
  else done(null, false);
});
const passport = require("passport");
passport.use(jwtAuth);
const requireJWTAuth = passport.authenticate("jwt", { session: false });

router.get("/d", requireJWTAuth, (req, res) => {
  res.send("ยอดเงินคงเหลือ 50");
});

module.exports = router;

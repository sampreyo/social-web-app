const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateUserInput = require("../../validator/register");
const validateLoginInput = require("../../validator/login");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/register", (req, res) => {
  const { errors, isValid } = validateUserInput(req.body);
  if (!isValid) {
    //console.log("aaaa");
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const NewUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          NewUser.password = hash;
          NewUser.save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);
  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        errors.password = "password incorrect";
        return res.status(400).json(errors);
      }
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({ success: true, token: "Bearer " + token });
      });
    });
  });
});
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: user.avatar,
    });
  }
);
router.post(
  "/photo",
  passport.authenticate("jwt", { session: false }),
  upload.single("product"),
  (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);
module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

router.get("/user/create", (req, res) => {
  res.render("user/create", { user: req.session.user });
});

router.post("/user/create/confirm", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = new User(username, hash, []);
  fs.mkdirSync("./data/user_list/" + username);
  fs.writeFile(
    "./data/user_list/" + username + "/data",
    JSON.stringify(user),
    () => {
      res.redirect("/");
    }
  );
});

router.get("/user/login", (req, res) => {
  res.render("user/login", { user: req.session.user });
});

router.post("/user/login/authenticate", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  fs.readFile("./data/user_list/" + username + "/data", (err, data) => {
    if (err) {
      res.redirect("/user/login");
    } else {
      const user = JSON.parse(data);
      const correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.session.user = {
          username: user.username,
        };
        res.redirect("/");
      } else {
        res.redirect("/user/login");
      }
    }
  });
});

router.get("/user/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;

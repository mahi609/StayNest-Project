const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {saveUrl}  = require("../middlwere");

const userController = require("../controller/userss");

// SIGNUP
router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post("/signup", userController.sigup);

// LOGIN
router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post("/login",
  saveUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
userController.login
);

router.get("/logout",userController.logout)

module.exports = router;

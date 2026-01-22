
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const engine = require("ejs-mate");

const User = require("./models/user");



require("dotenv").config({
  path: path.resolve(__dirname, ".env")
});



// ROUTERS
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

// DB
mongoose.connect("mongodb://127.0.0.1:27017/ainnb")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// VIEW ENGINE
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// SESSION
app.use(session({
  secret: "amazon-secret-key",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// PASSPORT need to session when i go multiple route it not need to login evvery whre
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  // find
passport.deserializeUser(User.deserializeUser()); // removie

// LOCALS
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // it return a user who are logged in but we cant acces in ejs therefore we local to acces them
  next();
});

// ROUTES
app.use("/listings", listingRoutes);
app.use("/listings/:id/review", reviewRoutes);
app.use("/", userRoutes);

// HOME
app.get("/", (req, res) => {
  res.send("App Working ✅");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

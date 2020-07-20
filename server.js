const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./controllers/user-ctrl");
const recipes = require("./controllers/recipe-ctrl");
const auth = require("./middleware/user");
const db = require("./db");

const app = express();
const apiPort = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.post("/signin", (req, res) => {
  users.handleSignin(req, res, bcrypt);
});

app.post("/register", (req, res) => {
  users.handleRegister(req, res, bcrypt);
});

app.get("/profile", auth, (req, res) => {
  users.getProfile(req, res);
});

app.post("/signout", auth, (req, res) => {
  users.handleSignout(req, res);
});

app.post("/recipe", auth, (req, res) => {
  recipes.addRecipe(req, res);
});

app.get("/recipes", (req, res) => {
  recipes.getRecipes(req, res);
});

app.get("/recipe/:id", (req, res) => {
  recipes.getRecipe(req, res);
});

app.listen(apiPort, () => console.log(`Server is running on port ${apiPort}`));

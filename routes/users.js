const express = require("express");
const UserModel = require("../models/user-model");
const router = express.Router();
const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");
router.use(cookieParser("secret"));

// /* cookies */
// router.get("/set", function (req, res) {

//   res.cookie("userIdsigned", "randomcookie", { signed: true });
//   res.send("Kaka sparad");
// });

// router.get("/cookies", function (req, res) {

//   res.send("Kaka med userID: " + req.signedCookies["userIdsigned"]);
// });

/* GET users */
router.get("/", async (req, res, next) => {
  const users = await UserModel.find();

  res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  try {
    const userId = await UserModel.findById(req.params.id);
    res.json(userId);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
});

/* POST new users */
router.post("/add", async (req, res, next) => {
  //random keys - cookies

  try {
    let encrypted = CryptoJS.SHA256(req.body.password, "Saltnyckel").toString();
    console.log(encrypted);
    const newUser = UserModel({
      ...req.body,
      password: encrypted,
      isLoggedIn: false,
    });
    console.log(newUser);
    newUser.save();
    res.json("Ny användare sparad" + newUser);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

/* PUT subscriptions */
//ändra användare i databasen (prenumeration)
router.put("/", async (req, res, next) => {
  try {
    const { _id, subscribed } = req.body;

    const user = await UserModel.findById({ _id: _id });

    user.subscribed = subscribed;
    await user.save();
    res
      .status(200)
      .json("Användaren har ändrat prenumeration till: " + user.subscribed);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});
//POST login
//autentisering
router.post("/login", async (req, res, next) => {
  const users = await UserModel.find();

  let foundUser = users.find((user) => {
    return (
      user.username == req.body.username && user.password == req.body.password
    );
  });

  if (foundUser) {
    foundUser.isLoggedIn = true;
    return res.json(foundUser._id);
  }

  res.send("Fel användarnamn eller lösen");
});

/* Ta bort användare? */
// router.delete('/:id', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;

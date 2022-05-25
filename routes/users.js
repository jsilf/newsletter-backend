const express = require("express");
const UserModel = require("../models/user-model");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser("secret"));

/* cookies */
router.get("/set", function (req, res) {
  res.cookie("userId", "randomcookie");
  //spara id från databasen i cookien
  res.cookie("userIdsigned", "randomcookie", { signed: true });
  res.send("Kaka sparad");
});

router.get("/cookies", function (req, res) {
  console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("Kaka med userID: " + req.signedCookies["userIdsigned"]);
});

/* GET users */
router.get("/", async (req, res, next) => {
  const users = await UserModel.find();

  res.status(200).json(users);
  //dekryptera lösen?
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
  //kryptera lösen?
  //random keys - cookies

  try {
    const newUser = UserModel(req.body);
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

/* Ta bort användare? */
// router.delete('/:id', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;

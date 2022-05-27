const express = require("express");
const UserModel = require("../models/user-model");
const router = express.Router();
const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");
router.use(cookieParser("secret"));
const nanoId = require("nanoid");

/* GET users */
router.get("/", async (req, res, next) => {
  const users = await UserModel.find();
  //console.log(users);
  res.status(200).json(users);
});

/* POST autentisering inloggning */
router.post("/login", async (req, res, next) => {
  const users = await UserModel.find();

  //jämför med krypterat lösen istället för avkryptering
  let encrypted = CryptoJS.SHA256(req.body.password, "Saltnyckel").toString();
  // console.log(encrypted);

  let foundUser = users.find((user) => {
    return user.username === req.body.username && user.password === encrypted;
  });

  if (foundUser) {
    foundUser.isLoggedIn = true;
    return res.json(foundUser._id);
  } else {
    res.status(401).send("Fel användarnamn eller lösen");
  }
});

/* POST skapa nya användare */
router.post("/add", async (req, res, next) => {
  try {
    const users = await UserModel.find();

    let randKey = nanoId.nanoid();

    //kryptera lösen
    let encrypted = CryptoJS.SHA256(req.body.password, "Saltnyckel").toString();

    let userExist = users.find((user) => {
      return user.username === req.body.username;
    });

    //validering om tom input eller användare finns, försökt igen
    if (userExist) {
      res.json("Användarnamnet finns redan");
    } else if (
      (req.body.username === "" && req.body.password === "") ||
      req.body.username === "" ||
      req.body.password === ""
    ) {
      res.json("Du måste fylla i både användarnamn och lösen");
    } else {
      //ny användare
      const newUser = await UserModel({
        ...req.body,
        password: encrypted,
        isLoggedIn: false,
        randomkey: randKey,
      });
      // console.log(newUser);
      newUser.save();
      res.json("Ny användare sparad, nu kan du logga in");
    }
  } catch (error) {
    console.log(error);
    res.json("Något blev fel vid skapande av användare");
  }
});

/* PUT, ändra prenumeration för inloggad användare */
router.put("/", async (req, res, next) => {
  try {
    const { _id, subscribed } = req.body;
    const user = await UserModel.findById({ _id: _id });
    user.subscribed = subscribed;
    await user.save();
    let subscriptionResponse = "";

    if (user.subscribed === true) {
      subscriptionResponse = "Nu prenumererar du på vårt nyhetsbrev!";
    } else {
      subscriptionResponse = "Du prenumererar inte längre på vårt nyhetsbrev.";
    }
    res.json(subscriptionResponse);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

module.exports = router;

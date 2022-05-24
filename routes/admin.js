var express = require("express");
var router = express.Router();
const UserModel = require("../models/user-model");

let htmlHead = `<head><link rel="stylesheet" href="/stylesheets/style.css" />
<script defer src="/javascripts/script.js"></script></head>`;

/* GET users and subscriptions */
router.get("/", function (req, res, next) {
  const form = `
  <form action="admin" method="post">
  <h2>Logga in här</h2>
  <label for="username">Användarnamn</label>
  <input type="text" name="username" id="username" />
  <label for="username">Lösenord</label>
  <input type="password" name="password" id="password" />
  <button type="submit">Logga in</button>
</form>`;

  res.send(htmlHead + form);
});

router.post("/", (req, res) => {
  // if inlogg stämmer, redirect till admin/users?
  res.send("Inloggad");
});

router.get("/users", async (req, res, next) => {
  const users = await UserModel.find();
  console.log("alla användare: " + users);

  let userInfo = `<div class='admin-container'><button id="logoutBtn">Logga ut</button>`;
  //kan man ha både res.send och res.redirect??
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log("Användare: " + user._id);

    userInfo += `
    
    <ul>
      <li>Användarnamn: ${user.username}</li>
      <li>${user.subscribed ? "Prenumererar" : "Prenumererar inte"}</li>
    </ul>
    `;
  }
  userInfo += "</div>";

  res.send(htmlHead + userInfo);
});

// router.get("/users/:id", function (req, res, next) {
//   res.send("Kolla på en specifik användare");
// });

module.exports = router;

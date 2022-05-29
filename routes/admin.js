var express = require("express");
var router = express.Router();
const UserModel = require("../models/user-model");
const cookieParser = require("cookie-parser");
const AdminUserModel = require("../models/adminuser-model");

router.use(cookieParser("secret"));

let htmlHead = `<link rel="stylesheet" href="/stylesheets/style.css" />`;

/* GET loginformulär för admin */
router.get("/", async (req, res, next) => {
  res.cookie("loggedIn", "false");

  const form = `
  <form action="/admin" method="post">
  <h2>Logga in här</h2>
  <label for="username">Användarnamn</label>
  <input type="text" name="username" id="username" />
  <label for="username">Lösenord</label>
  <input type="password" name="password" id="password" />
  <button type="submit">Logga in</button>
</form>`;

  res.send(htmlHead + form);
});

/* POST logga in */
router.post("/", async (req, res) => {
  const users = await AdminUserModel.find();

  let userId = "";
  let password = "";
  let username = "";

  users.forEach((user) => {
    userId = user._id.toString();
    username = user.username;
    password = user.password;
  });
  res.cookie("userIdsigned", userId, { signed: true });

  let usernameInput = req.body.username;
  let passwordInput = req.body.password;
  let userID = req.signedCookies["userIdsigned"];

  if (usernameInput === username && passwordInput === password) {
    res.cookie("loggedIn", "true");
    res.redirect(`/admin/${userID}/users`);
  } else {
    res.send(
      htmlHead +
        `<h1>Fel inlogg, </h1><a href="/admin"><button>Tillbaka till inloggsidan</button></a>`
    );
  }
});
/* Inloggad admin */
router.get("/:id/users", async (req, res, next) => {
  try {
    const users = await UserModel.find();

    if (req.cookies.loggedIn === "true") {
      let userInfo = `
    <h1>Administratörssida</h1>
    <div class='admin-container'>
    <a href="/admin"><button>Logga ut</button></a><table>
      <h3>Användare som prenumererar</h3>`;

      users.forEach((user) => {
        userInfo += `<p>
    ${user.subscribed ? `${user.username},` : ""}</p>
    <tr>
      <td>${user.username}</td>
      <td>${user.subscribed ? "Prenumererar" : "Prenumererar inte"}</td>
    </tr>`;
      });
      userInfo += "</table></div>";

      res.send(htmlHead + userInfo);
    } else {
      res.send("Du är inte inloggad");
    }
  } catch (error) {
    console.log(error);
  }
});

//Spara nya adminanvändare i databasen om det behövs
router.post("/add", async (req, res) => {
  try {
    const newAdminUser = AdminUserModel(req.body);
    newAdminUser.save();
    res.json("Ny adminanvändare sparad: " + newAdminUser);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      // user_name: req.body.username,
      // first_name: req.body.firstname,
      // last_name: req.body.lastname,
      // country: req.body.country,
      // password: req.body.password,
      // email: req.body.email,
      // profilePic: req.body.profilePic
      user_name: "maxim is gay",
      first_name: "Micha",
      last_name: "Napo",
      country: "Russia",
      password: "1234abc",
      email: "abcd",
      profilePic: "hhhhh"
    }
    let users = [];
    users = await DButils.execQuery("SELECT user_name from users");

    if (users.find((x) => x.user_name === user_details.user_name))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users (user_name, first_name, last_name, country, user_password, email) VALUES ('${user_details.user_name}', '${user_details.first_name}', '${user_details.last_name}', '${user_details.country}', '${hash_password}', '${user_details.email}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});


router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT user_name FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE user_name = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;


    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

// router.post("/Logout", function (req, res) {
//   req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
//   res.send({ success: true, message: "logout succeeded" });
// });

register();
module.exports = router;
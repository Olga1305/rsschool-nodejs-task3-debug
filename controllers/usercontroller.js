var router = require("express").Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const sequelize = require("../db");

router.post("/signup", async (req, res) => {
  const { fullName, userName, password, email } = req.body.user;
  try {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await sequelize.models.User.create({
      fullName,
      userName,
      passwordHash,
      email,
    });
    const token = jwt.sign({ id: user.id }, "lets_play_sum_games_man", {
      expiresIn: 60 * 60 * 24,
    });
    if (user && token) {
      res.status(200).json({
        user,
        token,
      });
    }
    res.status(500).json({
      error: "Creation fail",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { userName, password } = req.body.user;
  try {
    const user = await sequelize.models.User.findOne({
      where: { userName },
    });
    if (user) {
      bcrypt.compare(password, user.passwordHash, function (err, matches) {
        if (matches) {
          const sessionToken = jwt.sign(
            { id: user.id },
            "lets_play_sum_games_man",
            { expiresIn: 60 * 60 * 24 }
          );
          res.status(200).json({
            user,
            message: "Successfully authenticated.",
            sessionToken,
          });
        } else {
          res.status(403).send({ error: "Passwords do not match." });
        }
      });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

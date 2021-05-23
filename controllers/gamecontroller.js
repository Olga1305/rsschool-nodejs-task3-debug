var router = require("express").Router();
const sequelize = require("../db");

router.get("/all", async (req, res) => {
  try {
    const games = await sequelize.models.Game.findAll({
      where: { ownerId: req.user.id },
    });
    if (games.length) {
      res.status(200).json({
        games,
        message: "Data fetched.",
      });
    }
    res.status(404).json({
        error: "Data not found.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await sequelize.models.Game.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
    });
    if (game) {
      res.status(200).json({
        game,
      });
    }
    res.status(404).json({
        error: "Data not found.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/create", async (req, res) => {
  const { title, studio, esrbRating, userRating, havePlayed } =
    req.body.game;
  try {
    const game = await sequelize.models.Game.create({
      title,
      ownerId: req.user.id,
      studio,
      esrbRating,
      userRating,
      havePlayed,
    });
    if (game) {
      res.status(201).json({
        game,
        message: "Game created.",
      });
    }
    res.status(500).json({
        error: "Creation fail",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { title, studio, esrbRating, userRating, havePlayed } =
    req.body.game;
  try {
    const game = await sequelize.models.Game.update(
      {
        title,
        studio,
        esrbRating,
        userRating,
        havePlayed,
      },
      {
        where: {
          id: req.params.id,
          ownerId: req.user.id,
        },
      }
    );
    if (game > 0) {
      res.status(200).json({
        game,
        message: "Successfully updated.",
      });
    }
    res.status(204).json({
        error: "No content.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const game = await sequelize.models.Game.destroy({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });
    if (game) {
      res.status(200).json({
        game,
        message: "Successfully deleted",
      });
    }
    res.status(204).json({
        error: "No content.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

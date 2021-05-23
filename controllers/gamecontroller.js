var router = require("express").Router();
const sequelize = require("../db");

router.get("/all", async (req, res) => {
  try {
    const games = await sequelize.models.Game.findAll({
      where: { owner_id: req.user.id },
    });
    if (games.length) {
      res.status(200).json({
        games,
        message: "Data fetched.",
      });
    }
    res.status(404).json({
      message: "Data not found.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await sequelize.models.Game.findOne({
      where: { id: req.params.id, owner_id: req.user.id },
    });
    if (game) {
      res.status(200).json({
        game,
      });
    }
    res.status(404).json({
      message: "Data not found.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create", async (req, res) => {
  const { title, studio, esrb_rating, user_rating, have_played } =
    req.body.game;
  try {
    const game = await sequelize.models.Game.create({
      title,
      owner_id: req.user.id,
      studio,
      esrb_rating,
      user_rating,
      have_played,
    });
    if (game) {
      res.status(201).json({
        game: game,
        message: "Game created.",
      });
    }
    res.status(500).json({
        message: "Creation fail"
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { title, studio, esrb_rating, user_rating, have_played } =
    req.body.game;
  try {
    const game = await sequelize.models.Game.update(
      {
        title,
        studio,
        esrb_rating,
        user_rating,
        have_played,
      },
      {
        where: {
          id: req.params.id,
          owner_id: req.user.id,
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
      message: "No content.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const game = await sequelize.models.Game.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });
    if (game) {
      res.status(200).json({
        game,
        message: "Successfully deleted",
      });
    }
    res.status(204).json({
      message: "No content.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

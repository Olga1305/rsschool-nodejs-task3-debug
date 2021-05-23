const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models/user");
const Game = require("./models/game");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    operatorsAliases: 0,
  }
);

sequelize
  .authenticate()
  .then(
    function success() {
      console.log("Connected to DB");
    },

    function fail(err) {
      console.log(`Error: ${err}`);
    }
  )
  .then(async () => {
    await User(sequelize, DataTypes).sync({ force: true });
    await Game(sequelize, DataTypes).sync({ force: true });
  })
  .catch((err) => console.log(err));

module.exports = sequelize;

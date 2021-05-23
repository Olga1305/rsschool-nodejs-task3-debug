var express = require('express');
var app = express();
var sequelize = require('./db');
var user = require('./controllers/usercontroller');
var game = require('./controllers/gamecontroller')
const port = process.env.PORT || '4000';

sequelize.sync({ force: true });
app.use(express.json());
app.use('/api/auth', user);
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);
app.listen(port, function() {
    console.log(`App is listening on ${port}`);
})
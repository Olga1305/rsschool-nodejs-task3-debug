const jwt = require('jsonwebtoken');
const sequelize = require('../db');

module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next();   // allowing options as a method for request
    } else {
        var sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if (!sessionToken) return res.status(401).send({ auth: false, message: "No token provided." });
        else {
            jwt.verify(sessionToken, 'lets_play_sum_games_man', (err, decoded) => {
                if (decoded) {
                    sequelize.models.User.findOne({ where: { id: decoded.id } }).then(user => {
                        req.user = user;
                        console.log(`user: ${user}`)
                        next()
                    },
                        function () {
                            res.status(403).send({ error: "Forbidden" });
                        })

                } else {
                    res.status(403).send({ error: "Forbidden" })
                }
            });
        }
    }
}
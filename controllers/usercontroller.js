var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const sequelize = require('../db');

router.post('/signup', async (req, res) => {
    await sequelize.models.User.create({
        fullName: req.body.user.fullName,
        userName: req.body.user.userName,
        passwordHash: bcrypt.hashSync(req.body.user.password, 10),
        email: req.body.user.email,
    })
        .then(
            function signupSuccess(user) {
                let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                res.status(200).json({
                    user,
                    token
                })
            },

            function signupFail(err) {
                res.status(500).send(err.message)
            }
        )
});

router.post('/signin', async (req, res) => {
    await sequelize.models.User.findOne({ where: { userName: req.body.user.userName } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
                if (matches) {
                    var sessionToken = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user,
                        message: "Successfully authenticated.",
                        sessionToken
                    });
                } else {
                    res.status(502).send({ error: "Passwords do not match." })
                }
            });
        } else {
            res.status(403).send({ error: "User not found." })
        }

    })
});

module.exports = router;
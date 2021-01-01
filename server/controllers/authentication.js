const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

const tokenForUser = user => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
};

exports.signIn = (req, res, next) => 
res.send({ token: tokenForUser(req.user )});

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!email || !password) {
            return res.status(422).send({ error: 'You must provide an email and a password' });
        }

        if (user) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        const newUser = new User({
            email,
            password
        });

        newUser.save((err) => {
            if (err) {
                return next(err);
            }

            return res.send({ token: tokenForUser(newUser) });
        });
    });
};
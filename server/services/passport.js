const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const localOptions = {
    usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }).then((user, err) => {
        if (err) {
            return done(err, false);
        }

        if (!user) {
            return done(null, false);
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err, false); }

            if (!isMatch) { return done(null, false); }
            return done(null, user);
        });
    });
});

// Create JWT strategy
// Payload: decoded JWT token - user id and timestamp
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub).then((err, user) => {
        if (err) {
            return done(err, false);
        }

        if (user) { 
            done(user, true);
        }

        done(null, false);
    });
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
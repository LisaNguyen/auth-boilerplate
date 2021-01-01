const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
});

userSchema.pre('save',  function(next) {
    const user = this;
    // gen salt (randomly generated string of characters) and hash
    bcrypt.hash(user.password, SALT_ROUNDS, (err, hash) => {
        if (err) { return next(err); }
    
        // overwrite plain text password with encrypted password
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (!isMatch) {
            return callback(err);
        }

        callback(null, isMatch);
    });
};

// loads the model into mongoose
const User = mongoose.model('user', userSchema);

module.exports = User;
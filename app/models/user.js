// Load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
        lastname     : String,
        firstname    : String,
        city         : String,
    },
    widget           : {
        list         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// METHODS =============================================================
// =====================================================================

// Generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
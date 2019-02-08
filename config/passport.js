// Load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');
var configAuth      = require('./auth');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // passport session setup ==================================================
    // =========================================================================
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Local Login Strategy ====================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
        });

    }));

    // Local Signup Strategy ===================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var lastname = req.body.lastname;
        var firstname = req.body.firstname;
        var city = req.body.city;
            
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    var newUser            = new User();

                    newUser.local.email     = email;
                    newUser.local.password  = newUser.generateHash(password);
                    newUser.local.lastname  = lastname;
                    newUser.local.firstname = firstname;
                    newUser.local.city      = city;

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                    return done(null, newUser);
                    });
                }

            });    
        });
    }));
   
    

    // Google Strategy =========================================================
    // =========================================================================

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done) {
            process.nextTick(function() {
            if (!req.user) {
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                var user            = req.user;

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));

};
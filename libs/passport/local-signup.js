const Person = require('mongoose').model('Person');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
  usernameField: 'login',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, login, password, done) => {
  const userData = {
    login: login.trim(),
    password: password.trim(),
    name: req.body.name.trim()
  };

  const newUser = new Person(userData);
  newUser.save((err) => {
    if (err) { return done(err); }

    return done(newUser);
  });
});
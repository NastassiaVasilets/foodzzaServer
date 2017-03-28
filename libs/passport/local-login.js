const jwt = require('jsonwebtoken');
const Person = require('mongoose').model('Person');
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'login',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, login, password, done) => {
  const personData = {
    login: login.trim(),
    password: password.trim()
  };

  // find a user by login
  return Person.findOne({ login: personData.login }, (err, person) => {
    console.log('in auth function');
    if (err) { return done(err); }

    if (!person) {
      const error = new Error('Incorrect login or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return person.comparePassword(personData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        const error = new Error('Incorrect login or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: person._id
      };

      // create a token string
      var jwtSecret = 'a secret phrase!!';
      const token = jwt.sign(payload, jwtSecret);

      return done(null, token, person);
    });
  });
});

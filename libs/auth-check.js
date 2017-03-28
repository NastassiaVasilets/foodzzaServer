const jwt = require('jsonwebtoken');
const Person = require('mongoose').model('Person');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  const token = req.headers.authorization.split(' ')[1];

  var jwtSecret = 'a secret phrase!!';
  return jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) { return res.status(401).end(); }

    const personId = decoded.sub;

    return Person.findById(PersonId, (personErr, person) => {
      if (personErr || !person) {
        return res.status(401).end();
      }

      return next();
    });
  });
};

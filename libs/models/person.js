var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var Person = new Schema({
    name:  {type: String, require: true},
    login: {type: String, require: true},
    password: {type: String, require: true},
    phone: String,
    email: String
});

Person.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

Person.pre('save', function saveHook(next) {
  const person = this;

  if (!person.isModified('password')) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(person.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }
      person.password = hash;

      return next();
    });
  });
});

var PersonModel = mongoose.model('Person', Person);
module.exports = {
    PersonModel: PersonModel,
    PersonSchema: Person
};

var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/person', postPerson);

var PersonModel = require('../models/person').PersonModel;
function postPerson(req, res) {
    var person = new PersonModel({
        name: req.body.name,
        login: req.body.login,
        password: req.body.password,
        phone: req.body.phone,
        email: req.body.email
    });

    person.save(function (err) {
        if (!err) {
            log.info('person created');
            return res.send({ status: 'OK', user: person });
        } else {
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
}
exports.router = router;

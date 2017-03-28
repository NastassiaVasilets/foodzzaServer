var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/dishes/:id', getDish)

var DishModel = require('../models/dish').DishModel;
function getDish(req, res) {
    return DishModel.findOne({ _id: req.params.id }, function(err, dish){
        if (!err) {
            return res.send(dish);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        res.send(dish);
    });
}
exports.router = router;

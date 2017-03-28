var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/kitchens', getKitchens);

var KitchenModel = require('../models/kitchen').KitchenModel;
function getKitchens(req, res) {
    return KitchenModel.find({})
    .exec(function (err, kitchens) {
        if (!err) {
            return res.send(kitchens);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
}
exports.router = router;

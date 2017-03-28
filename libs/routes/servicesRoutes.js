var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/services', getServices);
router.post('/services', postServices);
router.get('/services/:_id', getService);
router.put('/services/:id', putService);
router.delete('/services/:id', deleteService);

var ServiceModel  = require('../models/service').ServiceModel;

function getServices(req, res) {
	return ServiceModel.find({}, function (err, services) {
        if (!err) {
            return res.send(services);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
}
function postServices(req, res) {
	var service = new ServiceModel({
        logo: req.body.logo,
        title:  req.body.title,
        kitchen: req.body.kitchen,
        mincost: req.body.mincost,
        costDelivery: req.body.costDelivery,
        departureTime: req.body.departureTime,
        workTime: req.body.workTime,
        phone: req.body.phone,
        dishes: req.body.dishes
    });

    service.save(function (err) {
        if (!err) {
            log.info('service created');
            return res.send({ status: 'OK', service:service });
        } else {
            console.log(err);
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
};
function getService(req, res) {
    return ServiceModel.findOne({ _id: req.params._id })
    .populate('dishes')
    .exec(function(err, service){
        if (!err) {
            return res.send(service.dishes);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        res.send(service);
    });
}
function putService(req, res){
    return ServiceModel.findById(req.params.id, function (err, service) {
        if(!service) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        service.logo = req.body.logo;
        service.title = req.body.title;
        service.kitchen = req.body.kitchen;
        service.mincost = req.body.mincost;
        service.costDelivery = req.body.costDelivery;
        service.departureTime = req.body.departureTime;
        service.workTime = req.body.workTime;
        service.phone = req.body.phone;
        service.dishes = req.body.dishes;
        return service.save(function (err) {
            if (!err) {
                log.info('service updated');
                return res.send({ status: 'OK', service:service });
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
    });
}
function deleteService(req, res){
    return ServiceModel.findById(req.params.id, function (err, service) {
        if(!service) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return service.remove(function (err) {
            if (!err) {
                log.info("service removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
}

exports.router = router;

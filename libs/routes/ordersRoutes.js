var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/orders', getOrders);
router.post('/orders', postOrders);
router.get('/orders/:_id', getOrder);
router.put('/orders/:id', putOrder);
router.delete('/orders/:id', deleteOrder);

var OrderModel = require('../models/order').OrderModel;
var PersonModel = require('../models/person').PersonModel;

function getOrders(req, res) {
    return OrderModel.find({})
    .populate('dishes')
    .exec(function (err, orders) {
        if (!err) {
            return res.send(orders);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
}
function postOrders(req, res) {
    var order = new OrderModel({
        owner: req.body.owner,
        dishes: req.body.dishes,
        service: req.body.service,
        time: req.body.time,
        subscriber: req.body.subscriber
    });
    order.save(function (err) {
        if (!err) {
            log.info('order created');
            return res.send({ status: 'OK', order: order });
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
}
function getOrder(req, res) {
    return OrderModel.findOne({ _id: req.params._id }, function(err, order){
        if (!err) {
            return res.send(order);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        res.send(order);
    });
}
function putOrder(req, res){
    return OrderModel.findById(req.params.id, function (err, order) {
        if(!order) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (req.body.flag === 'same') {
            PersonModel.findById(req.body.user._id, function (err, person) {
                order.subscriber.push({
                    person: person,
                    dishes: order.dishes,
                    paid: false
                });
                return order.save(function (err) {
                    if (!err) {
                        log.info('order updated');
                        return res.send({ status: 'OK', order:order });
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
        if (req.body.flag === 'ownDishes') {
            order.dishes = req.body.dishes;
            return order.save(function (err) {
                if (!err) {
                    log.info('order updated');
                    return res.send({ status: 'OK', order:order });
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
    });
}
function deleteOrder(req, res){
    return OrderModel.findById(req.params.id, function (err, order) {
        if(!order) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return order.remove(function (err) {
            if (!err) {
                log.info("order removed");
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

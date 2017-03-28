var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceSchema = require('./service').ServiceSchema;
var PersonSchema = require('./person').PersonSchema;
var DishSchema = require('./dish').DishSchema;

var Schema = mongoose.Schema;

var Order = new Schema({
    owner: PersonSchema,
    dishes: [DishSchema],
    service: ServiceSchema,
    time: Date,
    subscriber: [{ person: PersonSchema, dishes: [DishSchema], paid: Boolean }]
});

var OrderModel = mongoose.model('Order', Order);
module.exports = {
    OrderModel: OrderModel,
    OrderSchema: Order
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DishModel = require('./dish').DishModel;

var Service = new Schema({
    logo: String,
    title:  String,
    kitchen: String,
    mincost: Number,
    costDelivery: String,
    departureTime: String,
    workTime: String,
    phone: [String],
    dishes: [{ type: Schema.Types.ObjectId, ref: 'Dish' }]
});

var ServiceModel = mongoose.model('Service', Service);

module.exports = {
    ServiceModel: ServiceModel,
    ServiceSchema: Service
}

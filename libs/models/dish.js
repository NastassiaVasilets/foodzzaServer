var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dish = new Schema({
    name:  String,
    price: Number,
    url: String,
    category: String,
    picture: String
});

var DishModel = mongoose.model('Dish', Dish);
module.exports = {
	DishModel: DishModel,
	DishSchema: Dish
};

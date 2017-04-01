var ServiceModel = require('../libs/models/service').ServiceModel;
var DishModel = require('../libs/models/dish').DishModel;

var cityFoodBy = require('./cityFoodBy.json');
var edaBy = require('./edaBy.json');
var nakormimBy = require('./nakormimBy.json');
var pizzatempoBy = require('./pizzaTempoBy.json');
var sushiveslaBy = require('./sushiveslaBy.json');

var cityFoodByDishes = require('./dishes/cityFoodBy.json');
var edaByDishes = require('./dishes/edaBy.json');
var nakormimByDishes = require('./dishes/nakormimBy.json');
var pizzatempoByDishes = require('./dishes/pizzaTempoBy.json');
var sushiveslaByDishes = require('./dishes/sushiveslaBy.json');

var insertSeed = function (serviceData, dishesData) {
    var service = new ServiceModel(serviceData);

    service.dishes = dishesData.map(function (dish) {
        return new DishModel(dish);
    });

    var promises = service.dishes.map(function (dish) {
        return dish.save();
    });

    return Promise.all(promises).then(function () {
        return service.save();
    });
};

module.exports = function seed() {
    console.log('seed loading start');
    ServiceModel.remove({}, function () {
        DishModel.remove({}, function () {
            return Promise.all([
                insertSeed(cityFoodBy, cityFoodByDishes),
                insertSeed(nakormimBy, nakormimByDishes),
                insertSeed(pizzatempoBy, pizzatempoByDishes),
                insertSeed(edaBy, edaByDishes),
                insertSeed(sushiveslaBy, sushiveslaByDishes)
            ]).then(function() {
                console.log('seed loading finished');
            }).catch(function(err) {
                console.log('seed error %s', err);
            });
        });
    });
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Kitchen = new Schema({
    country:  {type: String, require: true},
    value: String,
    check: {type: Boolean, require: true}
});

var KitchenModel = mongoose.model('Kitchen', Kitchen);
module.exports = {
    KitchenModel: KitchenModel,
    KitchenSchema: Kitchen
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sneakerSchema = new Schema({
    name: String,
    brandId: String
});

module.exports = mongoose.model('Sneaker', sneakerSchema);
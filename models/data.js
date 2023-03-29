const mongoose = require('mongoose');

const DataSchema= new mongoose.Schema({
    state: String,
    district: String,
    market: String,
    commodity: String,
    variety: String,
    grade: String,
    arrival_date: String,
    min_price: String,
    max_price: String,
    modal_price: String,
}, {
    timestamps: true
});

DataSchema.index({state: 1, district: 1, market: 1, commodity: 1, variety: 1, arrival_date: 1}, {unique: true});


var Data = mongoose.model('Data', DataSchema);
module.exports = Data;
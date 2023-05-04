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
    unique_id: { 
        duplicate: false,
        type:String, 
        unique: true,
        required: true
    }
}, {
    timestamps: true
});



var Data = mongoose.model('Data', DataSchema);
module.exports = Data;
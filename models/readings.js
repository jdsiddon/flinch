var 
	mongoose = require('mongoose')
	, Schema = mongoose.Schema
;

var readingsSchema = new Schema({
	time: Date,
	x: Number,
	y: Number,
	z: Number
});

module.exports = mongoose.model('reading', readingsSchema);
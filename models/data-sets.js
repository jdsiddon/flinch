var 
	mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, readings = require('./readings')
;

var dataSetsSchema = new Schema({
	date: Date,
	g: Number,
	frequency: Number,
	reading: [readings.schema]
});

module.exports = mongoose.model('dataSet', dataSetsSchema);
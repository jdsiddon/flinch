var
	fs = require('fs')
//	, files = fs.readdirSync('./tests')
	, mongoose = require('mongoose')
	, dataSet = require('../models/data-sets')
	, standard = require('../lib/index')
	, mv = require('mv')
	, path = require('path')
	, data = require('../lib/data')
	, async = require('async')
;

/* Index Route */
exports.index = function(req, res){
	dataSet.find(function (err, docs) {
		res.render('index', { 
			Project: 'Accelerometer Data'
			, files: fs.readdirSync('./tests')
			, chartDocuments: docs
		});	
	});
};


exports.list = function(req, res) {
	res.render('list', {
		title: 'list',
		files: files
	});		
};

exports.convert = function(req, res) {
	var file = req.params['file'];
	console.log(file);

	data.convert(file, function (err, filePath){
		// Async call is done, alert via callback
		if (err) {
			console.log(err);
		} else {
		//	console.log(stuff);
			data.archive(file, filePath, function(err, success) {							// Move file to the archive folder.
				if (err) {
					res.send(err);
				} else {
				//	console.log(stuff);
					res.send(success);
				}
			});		
		}
	});
};

exports.chart = function(req, res) {
	console.log(req.params.chartData);
	dataSet.findOne({ name: req.params.chartData }, function(err, data) {
		if (err) console.log(err);
		
		var head = [data.date, data.g, data.frequency];					// Information about the data date, g force setting, and frequency
		var x = [];
		var y = [];
		var z = [];
		
		standard.asyncLoop(data.reading.length, function(loop) {
			var formatData = function(cb) {								// Function to peel apart single data points from the "Reading" doc
				var line = data.reading[loop.iteration()];				// Single object with "time, x, y, z" properties
				if (line.time != null) {								// Make sure data point is valid
					var tempT = line.time;									 
					var tempX = line.x;
					var tempY = line.y;
					var tempZ = line.z;

					x.push([tempT, tempX]);									// Push temp variables to individual arrays to fit within
					y.push([tempT, tempY]);									// highstock.js's API.
					z.push([tempT, tempZ]);
				}	
				cb();
				
			};
			formatData(function() {
				loop.next();											
			});
		}, function() {													// Executes after each data.reading subdocument has been looped through

			var pkg = {													// Package each individual array into object to send back to client 
				head: head,												// for graphing.
				x: x,
				y: y,
				z: z,
			};
			//console.log(pkg);											// Debugging
			
			res.send(pkg);												// Send the data
		});
	});
};
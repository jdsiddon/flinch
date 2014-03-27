var
	fs = require('fs')
	, files = fs.readdirSync('./tests')
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
	res.render('index', { 
		title: 'Gunsumer Price Index'
		, files: files
		, muppets: [ 'Kermit', 'Fozzie', 'Gonzo' ]
		, who: "ME"
	});	
};


exports.list = function(req, res) {
	res.render('list', {
		title: 'list',
		files: files	
	});
};

exports.convert = function(req, res) {
	console.log(files);
	
	/*standard.asyncLoop(files.length, function(loop) {
		var fileProcessor = function(cb) {*/
				
			// assuming openFiles is an array of file names and saveFile is a function
			// to save the modified contents of that file:

			//async.eachSeries(files, function(file, callback) {
		    // Call an asynchronous function (often a save() to MongoDB)
		    	data.convert('basic_moving.txt'/*file*/, function (err, data){
		      		// Async call is done, alert via callback
					if (err) {
						console.log(err);
					} else {
						console.log(data);
					}
		      		callback();
		    	});
		  	//},
		 	
			//	data.convert(item, function() {
			//	console.log('1');
		   //function(err){
		//		if (err) console.log(err);
			    // if any of the saves produced an error, err would equal that error
		//		console.log('alldone');
			//});
		
			/*
			data.convert(filePath, function(err, results) {
				if (err) {
					console.log('Not a file!');							// Not a file, probably a directory!
				} else {		
					console.log(data);									// Was a file, saved to db.
				}
				//cb();
				
			});*/
		/*	
		};
		fileProcessor(function() {
			loop.next();
		});
	}, function() {
		
		console.log('all done!');

	});*/
	
	
	
};

exports.chart = function(req, res) {
	dataSet.findOne({_id: '53346ddc84f8360000cbd93b'}, function(err, data) {
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
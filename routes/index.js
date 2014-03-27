var
	fs = require('fs')
	, files = fs.readdirSync('./tests')
	, mongoose = require('mongoose')
	, dataSet = require('../models/data-sets')
	, standard = require('../lib/index')
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

	
	fs.readFile(__dirname + '/x.txt', 'utf8', function (err, data) {
		if (err) throw err;		
		
			var lines = data.split('\n');
			var collectionInfo = lines.shift();						// Remove data collection information, stored in first array position
				
			collectionInfo = collectionInfo.split(',');				// Convert collectionInfo into array divided by comma's.
								
			var sample = new dataSet({
				date: collectionInfo[0],
				g: collectionInfo[1],
				frequency: collectionInfo[2],
			});

			standard.asyncLoop(lines.length, function(loop) {
				var testFunc = function(cb) {
					var line = lines[loop.iteration()];				// Single line "time, x, y, z"
					var items = line.split(',');					// Break line into array items = [time, x, y, z];
					
					sample.reading.push({
						time: items[0],
						x: items[1],
						y: items[2],
						z: items[3]
					});
				
					cb();
				};
				testFunc(function() {
					loop.next();
				});
			}, function() {
				sample.save(function(err) {
					console.log('all done!');
					res.send('done');
				});
			});
			
		
		
		/*
		$.each(lines, function(lineNo, line) {
			var items = line.split(',');	// Array 'items' = [time, x, y, z]

			var time = items.shift();

			$.each(items, function(itemNo, item) {

				var value = parseFloat(items[itemNo]);

				options.series[itemNo].data.push([time, value]);
			})

		});*/
	});
};

exports.chart = function(req, res) {
	dataSet.findOne({_id: '53337a3121b55024e8f7a8bf'}, function(err, data) {
		if (err) console.log(err);
	//	console.log(data.reading.length);
		
		var head = [data.date, data.g, data.frequency];					// Information about the data date, g force setting, and frequency
		var x = [];
		var y = [];
		var z = [];
		
		standard.asyncLoop(data.reading.length, function(loop) {
			var formatData = function(cb) {
				var line = data.reading[loop.iteration()];				// Single line "time, x, y, z"
			//	console.log(line);
			//	if (line.tempT == null) {								// Account for any entries with corrupted data;
				//	console.log('not valid');
				//	cb();
					
			//	} else {
					//console.log(line.split(','));
				//	var values = line.split(',');						// Break line into array items = [time, x, y, z];
					console.log(line);
					var tempT = line["time"];
					var tempX = line.x;
					var tempY = line.y;
					var tempZ = line.z;

					x.push([tempT, tempX]);	
					y.push([tempT, tempY]);	
					z.push([tempT, tempZ]);
					


				cb();
				
			};
			formatData(function() {
				loop.next();
			});
		}, function() {

			var pkg = {
				head: head,
				x: x,
				y: y,
				z: z,
			};
			console.log(pkg);
			res.send(pkg);
		});
			
	//	res.send(data.reading);
	});
};
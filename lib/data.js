var
	fs = require('fs')
	, mongoose = require('mongoose')
	, dataSet = require('../models/data-sets')
	, standard = require('./index')
	, path = require('path')
	, async = require('async')
	, mv = require('mv')
	, serialport = require('serialport')
	, SerialPort = serialport.SerialPort
	, moment = require('moment')
;

var data = {

	/* Convert .txt file to Mongoose Object and save to DB.
		 .txt file's first element should have short array with sensor data attached.
		 in format, start time, sensitivity (g's), and rate (hz) */
	convert: function(file, callback) {
		var filePath = path.normalize(file);			// Normalize the path to the file

		console.log(filePath);

		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err) callback('Not a file!', null);
			console.log(data);

			var counter = 0;
			var lines = data.split('\n');

			var collectionInfo = lines.shift();						// Remove data collection information, stored in first array position

			collectionInfo = collectionInfo.split(',');				 // Convert collectionInfo into array divided by comma's.

			var sample = new dataSet({													// Make new dataSet object
				name: file,
				date: collectionInfo[0],
				g: collectionInfo[1],
				frequency: collectionInfo[2]
			});
			console.log(sample);


			async.each(lines, function( line, callback) {
				// Perform operation on file here.
				//var items = lines[counter].split(',');					// Break line into array items = [time, x, y, z];
				var line = lines.shift();
				var items = line.split(',');

				sample.reading.push({
					time: items[0],
					x: items[1],
					y: items[2],
					z: items[3]
				});

			    callback();

			}, function(err){
				// if any of the saves produced an error, err would equal that error
				if( err ) {
			    // One of the iterations produced an error.
			    // All processing will now stop.
			     	console.log('A file failed to process');
					callback(err, null);
			    } else {
					dataSet.find({name: file}, function(err, docs) {							// There is already a file with that name
						//console.log(docs);														//	reupload file with new name.
					/*	if ( docs ) {
							console.log(docs);
							console.log('Rename file! One already exists');
							callback('Rename file! One already exists', null);
						} else { */
							sample.save(function() {
								//	console.log('All files have been processed successfully');
								//	console.log(sample);
									callback(null, filePath);
							});
				//		}
					});

			    }
			});

		});

	}, /* end convert */

	archive: function(fileName, oldPath, callback) {
		console.log(oldPath);
		var newPath = oldPath.split('/');
		console.log(newPath);

		mv(oldPath, './tests/archives/' + fileName, { mkdirp: true }, function(err) {
		  // done. it first created all the necessary directories, and then
		  // tried fs.rename, then falls back to using ncp to copy the dir
		  // to dest and then rimraf to remove the source dir
			if (err) {
				callback(err, null);
			} else {
				callback(null, 'succes');
			}

		});

	},

	unArchive: function(fileName, oldPath, callback) {
		console.log('fileName: ' + fileName);
		console.log('oldPath: ' + oldPath);
		var newPath = oldPath.split('/');
		console.log('newPath: ' + newPath);

		mv(oldPath + fileName, './tests/' + fileName, { mkdirp: true }, function(err) {
			if (err) {
				callback(err, null);
			} else {
				callback(null, 'moved!');
			}
		});
	},

	/* Read serial data from arduino. Everytime data comes across serial write data to text file in 'tests'
		 directory with name hour, minute, and second of test in HHMMSS, format. */
	log: function(data, cb) {
		var date = new Date();
		var dateWrapper = moment(date);												 // Create moment object
		var dateFolder = dateWrapper.format("MMDD");						// Folder name is Month and Day of test
		var fileName = dateWrapper.format("HHmmss");						// Filename is Hoursminutes and seconds of test
		var sampleSize = 500;																	 // Array length serial port is sending to node

		if(data.length === sampleSize) {									 		 // Check to make sure the data has all the readings
			/* Check if folder for testing MMDD already exists */
			fs.exists('./tests/' + dateFolder, function (exists) {

  			if (!exists) {
					/* Folder doesn't exist so we are going to make one */
					fs.mkdir('./tests/' + dateFolder, function(err) {
						if (err) throw err;
						console.log('dateFolder: ' + dateFolder);
					});
				}

				/* No matter what we still always need to write the file */
				var fullPath = './tests/' + dateFolder + '/' + fileName + '.txt';
				fs.writeFile(fullPath, data, function(err) {
					if (err) throw err;
					console.log(fileName + '.txt saved!');
					cb(null, fullPath);
				});
			});
		} else {
			cb('Sample size not large enough!', false);
		}
	},


	parse: function(data, cb) {
		console.log(typeof(data));
		var formattedData = data.split(' / ');
		for (var i = 0; i < formattedData.length; i++) {
			formattedData[i] = formattedData[i].concat('\n');
		}
		formattedData.pop();
		cb(formattedData);
	}



};

module.exports = data;

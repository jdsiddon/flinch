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

		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err) callback('Not a file!', null);

			var counter = 0;
			var lines = data.split('\n');
			var collectionInfo = lines.shift();						// Remove data collection information, stored in first array position

			collectionInfo = collectionInfo.split('|');				 // Convert collectionInfo into array divided by pipe's.
			collectionInfo[0] = collectionInfo[0].slice(0, -3);

			/* Replace frontslash in file route to create a unique name for the data reading.
			   comes out now as .tests0520165236.txt */
			fileStr = file.replace(/\//g, '');
			// Remove the '.tests' at the beginning of the filename and the '.txt' at the end of the filname.
			fileStr = fileStr.slice(6, -4);

			var sample = new dataSet({													// Make new dataSet object
				name: fileStr,
				date: collectionInfo[0],
				g: collectionInfo[1],
				frequency: collectionInfo[2]
			});
			console.log(sample);
			console.log('lines length: ' + lines.length);
			// Loop through each data reading and add as a subdoc to sample.
			async.each(lines, function( line, callback) {
				var line = lines.shift();
				var items = line.split('|');

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
			    /* One of the iterations produced an error.
			  		 All processing will now stop. */
			     	console.log('A file failed to process');
					callback(err, null);
			    } else {
						dataSet.find({name: file}, function(err, docs) {							// There is already a file with that name

							sample.save(function() {
									callback(null, filePath);
							});
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

	/* Write data string to text file in 'tests'
		 directory with name hour, minute, and second of test in HHMMSS, format. */
	log: function(data, cb) {
		var date = new Date();
		var dateWrapper = moment(date);												 // Create moment object
		var dateFolder = dateWrapper.format("MMDD");						// Folder name is Month and Day of test
		var fileName = dateWrapper.format("HHmmss");						// Filename is Hoursminutes and seconds of test
		var testArray = [];
		var sampleSize = 500;																	 // Number of data points collected (length of array on arduino).

		// Convert data to array to validate all data points are present.
		testArray = data.split('\n');
		/* Check if data has number of sample points its supposed to. +1 is to compensate for the intial data
		reading of the collection info i.e., time, freq, g's, etc. */
		if(testArray.length === sampleSize + 1) {									 		 // Check to make sure the data has all the readings

			// Check if folder for the date of testing in 'MMDD' already exists.
			fs.exists('./tests/' + dateFolder, function (exists) {
				// Folder doesn't exist so we are going to make one.
  			if (!exists) {
					fs.mkdir('./tests/' + dateFolder, function(err) {
						if (err) throw err;
					});
				}

				// No matter what we still always need to write the file.
				var fullPath = './tests/' + dateFolder + '/' + fileName + '.txt';

				fs.writeFile(fullPath, data, function(err) {
					if (err) throw err;

					cb(null, fullPath);
				});
			});
		} else {
			// Sample wasn't the correct data size.
			cb('Incorrect Sample Size! Expecting: ' + sampleSize.toString() + ' Received: ' + testArray.length, false);
		}
	},


	parse: function(data, cb) {

		// Split 'data' into an array on ' / '.
		var formattedData = data.split(' / ');
		var dataString;

		// Convert the data array to a string.
		dataString = formattedData.toString();
		// Replace all commas with newline character in string.
		dataString = dataString.replace(/,/g,'\n');
		// Send string to callback.
		cb(dataString);
	}



};

module.exports = data;

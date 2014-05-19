







var
	express = require('express')
	, app = express()
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, engine = require('ejs-locals')
	, mongoose = require('mongoose')
	, data = require('./lib/data')
	, serialport = require('serialport')
	, SerialPort = serialport.SerialPort
;

// create new sp object, instance of SerialPort.
// /dev/cu.usbmodem411
// /dev/tty.usbserial-A603HVO0
var sp = new SerialPort("/dev/cu.usbmodem31691", {	// MUST CHANGE BASED ON SERIAL PORT!!!
	baudrate: 115200,
	parser: serialport.parsers.readline("\n")			// parse on newline
}, false);




var connStr = 'mongodb://localhost/shooting-data';

mongoose.connect(connStr, function(err) {
	if (err) throw err;
	console.log('Successfully connected to MongoDB');
});

app.engine('ejs', engine);

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/list', routes.list);
app.get('/convert/:file', routes.convert);
app.get('/chart/:chartData', routes.chart);
app.get('/remove/:id', routes.remove);

app.get('/files', routes.files);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));

	sp.open(function() {
		console.log("Serial Port Open");
		var readyCounter = 0;

		// On data event
		sp.on('data', function (allData) {
			/*if(allData == 1 && readyCounter != 1) {
				readyCounter = 1;
				console.log("Ready!");
			} else if(readyCounter == 1) {
			*/
				/* Take raw data from sensor and split data points on "/" and turn it into an
				array of data.*/
				data.parse(allData, function(dataArray) {
					//console.log("dataArray " + dataArray);
					data.log(dataArray, function(err, fileNameLoc) {
						if (err) throw(err);

						data.convert(fileNameLoc, function(err, savedFile) {
							console.log(savedFile);
			//			readyCounter = 0;
						});

					});
				});
	//	}

		});
	});

});

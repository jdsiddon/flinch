var
	express = require('express')
	, app = express()
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, engine = require('ejs-locals')
	, mongoose = require('mongoose')
	, data = require('./lib/data')
	, startSerialConn = require('./lib/serial')
	, serialport = require('serialport')
	, SerialPort = serialport.SerialPort
;



// Open connection to local MongoDB
var connStr = 'mongodb://localhost/shooting-data';

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
app.get('/convert/:file', routes.convert);			// This route is now automatic.
app.get('/chart/:chartData', routes.chart);
app.get('/remove/:id', routes.remove);
app.get('/render/:data', routes.renderVideo);
app.get('/files', routes.files);
app.get('/render', routes.render);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));

	mongoose.connect(connStr, function(err) {
		if (err) throw err;
		console.log('Successfully connected to MongoDB');

		serialport.list(function (err, ports) {
  		ports.forEach(function(port) {
				console.log(port);
				if (port.manufacturer == 'Teensyduino') {
					console.log('Teensy plugged in on ' + port.comName + ', connecting now...');
					startSerialConn(port.comName);
				}
				if (port.comName == '/dev/cu.PL2303-00002014') {
					console.log('Flinch plugged in on ' + port.comName + ', you are are ttyl converter!');
					console.log('Connecting now...');
					startSerialConn(port.comName);
				}
			});
			/*
			ports.forEach(function(port) {
    		console.log('name: ' + port.comName);
  		});

			process.stdin.on('data', function(input) {
				console.log(input);

				ports.forEach(function(port) {
					console.log(port);
					process.stdout.write(typeof input);
					process.stdout.write(typeof port);
					if (port == input.toString()) {
						console.log('You selected: ' + input.toString());

						startSerialConn(port);

					} else {
						console.log('Please select valid serial port');
					}
				});
			});*/
		});
	});

});

var
	express = require('express')
	, app = express()
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, engine = require('ejs-locals')
	, mongoose = require('mongoose')
;

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

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


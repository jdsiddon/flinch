var
  serialport = require('serialport'),
  SerialPort = serialport.SerialPort,
  data = require('./data')
;

var startSerialConn = function(port, cb) {

  /* Create new 'sp' object which is an instance of SerialPort. Must change "/dev/tty"
    to be available serial object. */
  var sp = new SerialPort(port, {	// MUST CHANGE BASED ON SERIAL PORT!!!
    baudrate: 115200,
    parser: serialport.parsers.readline("\n")			// Parse data on newline
  }, false);

  sp.open(function() {

    console.log("Serial Port Open");

      var readyCounter = 0;

      // On data event
      sp.on('data', function (allData) {
          /* Take raw data from sensor and split data points on "/" and turn it into an
          array of data.*/
        data.parse(allData, function(dataString) {
          data.log(dataString, function(err, fileNameLoc) {
            if (err) throw (err);
            data.convert(fileNameLoc, function(err, savedFile) {
              if (err) throw (err);
              console.log(savedFile);
            });
          });
        });
      });

  //	});

  });
};


module.exports = startSerialConn;

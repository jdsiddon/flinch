
var standard = {

	asyncLoop: function (iterations, func, callback) {
	    var index = 0;
	    var done = false;
	    var loop = {
	        next: function() {
	            if (done) {
	                return;
	            }

	            if (index < iterations) {
	                index++;
	                func(loop);

	            } else {
	                done = true;
	                callback();
	            }
	        },

	        iteration: function() {
	            return index - 1;
	        },

	        break: function() {
	            done = true;
	            callback();
	        },
			
			index: function() {
				return index;
			}
	    };
	    loop.next();
	    return loop;
	}
	
};

module.exports = standard;
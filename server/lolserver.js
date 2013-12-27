// This solves the issue
//var require = __meteor_bootstrap__.require;
var Future = Npm.require('fibers/future');
//var SerialPort = SerialPort;

Meteor.startup(function() {
	var sp = new SerialPort('/dev/ttyACM0', {
		baudrate : 115200
	}, true);

	sp.on("open", function() {
		setInterval(30, function() {
			for (var x = 0; x < 16; x++) {
				sp.write(new Buffer('DR ' + x + ' 255 255 255 255 \n'));
			}
		});

	});

});

Meteor.methods({
	uploadFile : function(file) {
		file.save('/home/tiberiu/Documents/workspaces/aptana/lol', {});
	}
});


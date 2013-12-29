LolSerial = function(options) {
	_.extend(this, this.defaults, options || {});
	this.bitmap = this.bitmap || new Bitmap(options);
	this.bitmap.randomize();
	this.initSerialPort();
	this.attachOpenHandler();
};

LolSerial.prototype = {
	defaults : {
		port : '/dev/ttyACM0',
		baudrate : 115200,
		connectImmediatly : true,
		drawIntervalMilis : 30
	},
	initSerialPort : function() {
		this.sp = new SerialPort(this.port, {
			baudrate : this.baudrate
		}, this.connectImmediatly);
	},
	attachOpenHandler : function() {
		var self = this;
		if (this.sp) {
			this.sp.on("open", _.bind(this.intervalLoop, this));
		}
	},
	intervalLoop : function() {
		var x = setInterval(_.bind(this.step, this), this.drawIntervalMilis);
	},
	step : function() {
		var value = this.bitmap.rawValue();
		var b = this.bitmap.bytesPerRow();
		var a = (value.length / b);
		for (var x = 0; x < a; x++) {
			var buff = '';
			for (var y = 0; y < b; y++) {
				var val = value[x * b + y];
				buff += '' + ( val ? val : 0) + ' ';
			}
			this.sp.write(new Buffer('DR ' + x + ' ' + buff + '\n'));
		}
		this.sp.write(new Buffer('BD\n'));
	}
};

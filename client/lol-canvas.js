LolCanvas = function(options) {
	options = _.extend(this, this.defaults, options);
	this.canvas = options.canvas;
	this.ctx = this.canvas.getContext('2d');
	this.bitmap = new Bitmap(options);
	this.bitmap.randomize();
	this.attachEvents();
	this.resize();
	if (this.autoStart){
		this.intervalId = window.requestAnimationFrame(_.bind(this.startAnimLoop, this));
	}
	

};

LolCanvas.prototype = {
	defaults : {
		w : 32,
		h : 16,
		onColor : 'rgb(255,0,0)',
		offColor : 'transparent',
		autoStart : true

	},
	attachEvents : function() {
		window.addEventListener('resize', _.bind(this.resize, this), false);
	},

	resize : function(event) {
		var width = this.canvas.clientWidth;
		this.canvas.width = width;
		var size = width / this.bitmap.w;
		this.dotSpacing = Math.floor(size * 10 / 100);
		this.dotSize = size - this.dotSpacing;
		var height = this.bitmap.h * size;
		this.canvas.height = height;
		this.draw();

	},
	draw : function() {
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.bitmap.randomize();
		this.ctx.save();
		this.ctx.lineWidth = 1;
		this.ctx.translate(0.5, 0.5);
		this.drawDotmap();
		this.ctx.restore();
	},
	drawDotmap : function() {
		this.ctx.fillStyle = this.color;
		for (var y = 0; y < this.bitmap.h; y++) {
			for (var x = 0; x < this.bitmap.w; x++) {
				this.ctx.fillStyle = 'rgb(0,0,0)';
				this.drawDot(x, y, this.color);
			}
		}
	},
	drawDot : function(x, y) {
		this.ctx.fillStyle = this.bitmap.getValue(x, y) ? this.onColor : this.offColor;
		var xpos = x * (this.dotSize + this.dotSpacing);
		var ypos = y * (this.dotSize + this.dotSpacing);
		this.ctx.fillRect(xpos, ypos, this.dotSize, this.dotSize);
		this.ctx.strokeRect(xpos, ypos, this.dotSize, this.dotSize);
	},
	startAnimLoop : function() {
		this.intervalId = window.requestAnimationFrame(_.bind(this.startAnimLoop, this));
		this.draw();
	},
	stopAnimLoop : function(){
		window.cancelAnimFrame(this.intervalId);
	}
};


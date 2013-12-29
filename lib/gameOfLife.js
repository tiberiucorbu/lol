GameOfLife = function(options) {
	options = options || {};
	this.toroidal = options.toroidal;
	this.bitmap = options.bitmap;
	this.detectFreez = options.detectFreez || -1;
	if (options.detectFreez > -1) {
		this.history = new History(options.detectFreez);
	}
	this.generation == 0;
};

GameOfLife.prototype = {

	next : function() {
		this.computeNextGeneration({
			x : 0,
			y : 0
		}, {
			x : this.bitmap.w - 1,
			y : this.bitmap.h - 1
		});
		this.generation++;
	},
	/**
	 * Calculates the next generation for rectangular area defined b
	 */
	computeNextGeneration : function(pixel0, pixel1) {
		var result = [];
		for (var x = pixel0.x; x <= pixel1.x; x++) {
			for (var y = pixel0.y; y < pixel1.y; y++) {

				var lives = this.cellLives({
					x : x,
					y : y
				});
				//console.log(x+' '+y);
				var idx = this.bitmap.idxFromCoord(x, y);
				//console.log(idx);
				if (idx.x >= 0) {
					result[idx.x] = this.bitmap.setBit(result[idx.x] || 0, idx.bitNum, lives);
				}
			}
		}

		this.bitmap.rawCopy(result);
		this.defreeze(result);
	},
	defreeze : function(result) {
		if (this.detectFreez === -1) {
			return;
		}
		if (this.detectFreez == this.history.elements.length && this.hadResult(result, this.history.elements)) {
			this.bitmap.randomize();
			this.history = new History(this.detectFreez);
			this.generation == 0;
			return;
		}
		this.history.add(result);
	},
	hadResult : function(result, prevResults) {
		var notEqualSer = [];
		for (var i = 0; i < result.length; i++) {
			for (var j = 0; j < prevResults.length; j++) {
				if (notEqualSer[j]) {
					continue;
				}
				notEqualSer[j] = (result[i] != prevResults[j][i]);
			}
		}

		for (var i = 0; i < notEqualSer.length; i++) {
			if (!notEqualSer[i]) {
				return true;
			}
		}
	},
	/**
	 * Applyes Conway's - Game of Life rules for a cell as follows
	 * 	1 Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	 * 	2 Any live cell with two or three live neighbours lives on to the next generation.
	 * 	3 Any live cell with more than three live neighbours dies, as if by overcrowding.
	 *	4 Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	 *
	 * @param pixel  - coordonates
	 *
	 * @return true if the cell lives or false if the cell dies in the next generation
	 */
	cellLives : function(pixel) {
		var s = this.getSouroundings(pixel, 1), aliveNeighbours = 0, isAlive = this.getBitmapValue(pixel);
		for (var x = 0; x < s.length; x++) {
			var alive = this.getBitmapValue(s[x]);
			if (alive) {
				aliveNeighbours++;
			}
		}
		//3 Any live cell with more than three live neighbours dies, as if by overcrowding.
		//aliveNeighbours > 3
		//1 Any live cell with fewer than two live neighbours dies, as if caused by under-population.
		// aliveNeighbours<2
		var result = false;
		//2 Any live cell with two or three live neighbours lives on to the next generation.
		if (isAlive && (aliveNeighbours == 2 || aliveNeighbours == 3)) {
			result = true;
			//4 Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		}
		if (!isAlive && aliveNeighbours == 3) {
			result = true;
		}
		return result;
	},
	getBitmapValue : function(pixel) {
		pixel = this.addaptPixel(pixel);
		return this.bitmap.getValue(pixel.x, pixel.y);
	},
	addaptPixel : function(pixel) {
		if (this.toroidal) {
			var x = _.toroidalValue(0, this.bitmap.w, pixel.x);
			var y = _.toroidalValue(0, this.bitmap.h, pixel.y);
			pixel = {
				x : x,
				y : y
			};
		}
		return pixel;
	},
	/**
	 * Calculates the coordinates of the sourounding of a pixel
	 *
	 * @param {Object} pixel - coordinates of the pixel
	 * @param {Object} r radius
	 *
	 * @return an array of coordinates
	 */
	getSouroundings : function(pixel, r) {
		var length = r * 2 + 1;
		var pixels = [];
		var alfa = (length - 1) / 2;
		var ialfa = -1 * alfa;
		for (var i = ialfa; i <= alfa; i++) {
			pixels.push({
				x : pixel.x - i,
				y : pixel.y + ialfa
			});
		}
		for (var i = ialfa; i < alfa; i++) {
			pixels.push({
				x : pixel.x + ialfa,
				y : pixel.y - i
			});
		}
		for (var i = ialfa; i < alfa; i++) {
			pixels.push({
				x : pixel.x - i,
				y : pixel.y + alfa
			});
		}
		for (var i = ialfa + 1; i < alfa; i++) {
			pixels.push({
				x : pixel.x + alfa,
				y : pixel.y - i
			});
		}
		return pixels;
	}
};


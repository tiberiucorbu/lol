//var Future = Npm.require('fibers/future');

Meteor.startup(function() {

	var dirty = false;
	var displaySize = {
		w : 32,
		h : 16
	};
	var gol = new GameOfLife({
		bitmap : new lol.MonoBitmap(displaySize),
		toroidal : false,
		detectFreez : 10
	});
	gol.bitmap.randomize();
	var text = new lol.TextBitmap(displaySize);
	text.write('G');
	text.write('A');
	text.write('M');
	text.write('E');
	setInterval(function() {
		gol.next();
		dirty = true;
	}, 50);

	var lolSerial = new LolSerial(_.extend({
		stepCallback : function(bitmap) {
			bitmap.copy(0, 0, gol.bitmap);
			bitmap.copy(4, 4, text.bitmap, true);
		}
	}, displaySize));

});

Meteor.methods({
	uploadFile : function(file) {
		file.save('/home/tiberiu/Documents/workspaces/aptana/lol', {});
	}
});


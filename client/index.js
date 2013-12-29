var startup = function() {
	$(document).ready(ready);
};

var ready = function() {
	var canvas = $('#lolDisplay')[0];
	var display = new LolCanvas({
		canvas : canvas,
	});
};

Meteor.startup(startup);

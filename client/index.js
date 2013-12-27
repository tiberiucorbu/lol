Template.hello.greeting = function() {
	return "Welcome to lol.";
};

Template.hello.events({
	'click input' : function() {
		// template data, if any, is available in 'this'
		alert('Helloo');
	}
}); 
Package.describe({
	summary : 'Little underscre extension'
});

Package.on_use(function(api) {
	api.use(['underscore'], ['client', 'server']);
	//api.export(['', 'GameOfLife']);
	api.add_files('valueutils.js', ['client', 'server']);
});

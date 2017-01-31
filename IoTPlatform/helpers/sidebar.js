var Stats = require('./stats'),
	Help = require('./help');

module.exports = function(viewModel,callback){
		viewModel.sidebar= {
			stats: Stats(),
			help: Help.devices(viewModel)
		};
		callback(viewModel);
};

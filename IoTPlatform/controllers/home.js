var Models = require('../models').Devices;
var sidebar = require('../helpers/sidebar');
module.exports = {
	index: function(req,res){
		var viewModel = {
			Devices: []
		};
		Models.find({},{},{sort: {timestamp:-1}},function(err,docs){
		if(err)
		{
			console.log(err);
		}
		viewModel.Devices= docs;
		sidebar(viewModel, function(viewModel){
			res.render('index',viewModel);
		});	
	});
		
		
	}
};

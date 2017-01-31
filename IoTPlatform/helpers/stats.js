var Models = require('../models').Devices;

module.exports = function()
{
	var count;
	var stats={};
	Models.find({},function(err,docs){
		if(err) 
			console.log(err);
		else
		{	
			count = Object.keys(docs).length;
			console.log(count);
	
			stats.total=count;
			stats.online= 0;
			
		}
	});
	return stats;
}

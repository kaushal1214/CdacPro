var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DeviceSchema =new Schema({
	name:		{type: String},
	description: 	{type: String},
	id:		{type: String},
	value:		{type: Number, 'default':0},
	type:		{type: String},
	data: 		[{	
				_id: false,
				 x: {type: Number, 'default':0},
				 y: {type: Number, 'default':0}
			}], 
	geolocation:    { 
				latitude: {type: Number, 'default': 18.5479886},
			    	longitude:{type: Number, 'default': 73.7878585}
			},
	timestamp:	{type: Date ,'default': Date.now},
	updatetime:	{type: Date, 'default': Date.now}
});

module.exports= mongoose.model('Device',DeviceSchema);

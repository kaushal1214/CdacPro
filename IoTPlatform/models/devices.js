var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DeviceSchema =new Schema({
	name:		{type: String},
	description: 	{type: String},
	id:		{type: String},
	value:		{type: Number, 'default':0},
	type:		{type: String},
	geolocation:    { 
				latitude: {type: Number, 'default': 18.5479886},
			    	longitude:{type: Number, 'default': 73.7878585}
			},
	timestamp:	{type: Date ,'default': Date.now}
});1

module.exports= mongoose.model('Device',DeviceSchema);

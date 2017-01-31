var Models = require('../models');
var sidebar = require('../helpers/sidebar');
var MQTT = require('mqtt');
const  client = MQTT.connect('mqtt://127.0.0.1');

//Code for Setting up the MQTT
var M_CONNECT =false;
client.on('connect',function(){
	console.log('MQTT broker connected');		
	M_CONNECT = true;
});

var TIME=1;

//Code for Websocktes
var websocket = require('ws').Server,
	wss = new websocket({port:8888});
var SOCKET =false;
var socket;

//Connection Event 
wss.on('connection', function connection(ws){
	SOCKET = true;
	socket = ws;
	
	Models.Devices.find({},function(err,docs){
                       if(err)
                                console.log("Some error");
                        else
			{	
				//To count the total collections on databases
                               	var count = Object.keys(docs).length - 1;
				while(count >=0)
				{	//String send to the Android App to syncronize with Current data of sensor
					//Format: Data-Soil:34
					ws.send("Data-"+docs[count].type+":"+docs[count].value);
					count--;
				}
			}
        });


	ws.on('message', function incoming(message){
		console.log('Msg from Websocket Client: %s',message);
		/*-------------------------------------------------------------------
		* Filtering out the messages for controlling the relays on the field
		*--------------------------------------------------------------------*/
		if(M_CONNECT)
		{
			if(message=="Actuator-Pump1:ON")
			{	message = "Pump1";
				console.log('Pump 1: ON');
				client.publish('hello','1,1');
			}
			else if(message=="Actuator-Pump1:OFF")
			{
				console.log('Pump 1: OFF');
				client.publish('hello','1,0');
			}
			else if(message=="Actuator-Ventilator1:ON")
			{
				console.log('Ventilator 1: ON');
				client.publish('hello','2,1');
			}
			else if(message=="Actuator-Ventilator1:OFF")
			{
				console.log('Ventilator 1: OFF');
				client.publish('hello','2,0');
			}
		}
	});
});

module.exports ={
	/*--------------------------------------------------------------------------------------
	* Purpose: To render the start page of the website i.e displays all the device details
	*---------------------------------------------------------------------------------------*/
	index: function(req,res){
		var viewModel ={
			device:{}
		}
		Models.Devices.findOne({id: {$regex: req.params.device_id}},function(err,docs){
			if(err)
			{
				console.log(err);
			}
			if(docs)
			{
				viewModel.device = docs;
				sidebar(viewModel,function(viewModel){
					res.render('device',viewModel);
				});
				
			}
			else{
				res.redirect("/");
			}
		});
	
	},
	/*-------------------------------------------------------------
	* Purpose: Function to generate a unique id for our device
	*-------------------------------------------------------------*/
	create: function(req, res){
		var saveDevice = function(){
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
			var devUrl= '';
			for ( var i =0; i<=6  ; i +=1)
			{
				devUrl += possible.charAt(Math.floor(Math.random()*possible.length));
			}
			Models.Devices.find({id:devUrl},function(err,docs){
				if(docs.length > 0)
				{
					saveDevice();
				}
				else
				{
					var newDev = new Models.Devices({
						name: req.body.title,
						description: req.body.des,
						type: req.body.sensors,
						geolocation:{ latitude :req.body.latt,
							      longitude:req.body.longi},
						
						id: devUrl
					});
					newDev.save(function(err,dev){
						res.redirect('/devices/'+devUrl);
					});
				}
			});
			
		};
		saveDevice();
		
	},

	/*------------------------------------------------------------------------------------
	* Purpose: This is will be called to 'GET' the sensor data along with all its details
	*----------------------------------------------------------------------------------*/
	values: function(req,res){
		Models.Devices.findOne({id: {$regex: req.params.device_id}},function(err, docs){
			if(err){
				console.log(err);
			}
			if(docs)
			{	
				res.json(docs);
			
			}
			else
				res.json({});
		});
	
		
	},
	/*-------------------------------------------------------------------------------
	* Purpose: This will be called to update the particular device value( POST Method)
	*--------------------------------------------------------------------------*/
	data: function(req,res,next){
		var Type;
		var Count;	

		Models.Devices.findOne({id: {$regex: req.params.device_id}},function(err, docs){
                        if(err){
                                console.log(err);
                        }
                        if(docs)
                        {
                                Type = docs.type;
				Count = docs.data;
				console.log('Count',Count.length);
				console.log(Type);
	                        if(SOCKET)
         		        	socket.send("Data-"+Type+":"+req.body.data);
                		
                        }
                });
		TIME = TIME +1;
		Models.Devices.update({id:{$regex: req.params.device_id}},{$set:{value:req.body.data,
										updatetime:Date.now()},$push: {data: { x:TIME, y:req.body.data}}},function(err,docs){
			if(err) console.log(err);
			else
			console.log("Data has been updated!");
		});	
		res.send('OK');
	},
	
	/*-----------------------------------------------------------------------
	* Purpose: To DELETE the particular device using its ID in the url
	*-----------------------------------------------------------------------*/
	delete: function(req,res){
		Models.Devices.remove({id:{$regex: req.params.device_id}},function(err,docs){
			if(err) console.log(err);
			console.log("Device has been removed.");
		});
		res.send('DELETED');
	},
	
	/*--------------------------------------------------------------------
	* Purpose: To update the geolocation of the data only
	*-------------------------------------------------------------------*/
	geo: function(req,res){
		console.log(req.params.device_id);
		Models.Devices.update({id:{$regex:req.params.device_id}},{$set:{geolocation:{latitude: req.body.lat, longitude: req.body.lon}}},function(err,docs){
		if(err) console.log(err);
		console.log("New Geolocation has been updated!");
	});	
		res.redirect('/devices/'+req.params.device_id);
	}
};

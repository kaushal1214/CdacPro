var mqtt = require('mqtt'),
	client = mqtt.connect('mqtt://192.168.43.201');
var JSON = require('JSON');
var http = require('http'),
	querystring = require('querystring');


//Connect callback for MQTT
client.on('connect', function(){
	console.log('MQTT Broker connected');
	client.subscribe('hello');
});

//Subscribe
client.on('message', function(topic, msg){
	var json = JSON.stringify(eval('('+msg.toString()+')'));
	json = JSON.parse(json);
	var payload={};
	
	if(json.Data)
	{
		console.log('Data:'+json.Data);
		payload.data = json.Data;
	}
	
	var postData = querystring.stringify(payload);	
	
	var options ={
		hostname: '192.168.43.201',
		port: 3300,
		path: '/devices/'+json.Device,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
			}
	};
	var req = http.request(options,function(res){

	});

	req.write(postData);
	req.end();

	//client.end();
});

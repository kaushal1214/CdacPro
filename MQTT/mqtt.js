var mqtt = require('mqtt'),
	client = mqtt.connect('mqtt://127.0.0.1');
var JSON = require('JSON');
var http = require('http'),
	querystring = require('querystring');

//Dummy Data
var DHT11 ="{Temp:23 ,Humidity:160, Device:'1m4uri7'}";

//Connect callback for MQTT
client.on('connect', function(){
	console.log('MQTT Broker connected');
	client.subscribe('hello');
	client.publish('hello',DHT11);
});

//Subscribe
client.on('message', function(topic, msg){
	var json = JSON.stringify(eval('('+msg.toString()+')'));
	json = JSON.parse(json);
	var payload={};
	if(json.Temp)
	{
		console.log('Temp:'+json.Temp);
		payload.field2 = json.Temp;
	}
	if(json.Humidity)
	{
		console.log('Humidity:'+json.Humidity);
		payload.data = json.Humidity;
	}
//	payload.api_key='VJUDF7AMIKTNC1TU';
	var postData = querystring.stringify(payload);	
	
	var options ={
		hostname: 'localhost',
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

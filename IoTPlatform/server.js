/*---------------------------------------------------
* File: Server.js
* Purpose: To create a server using Express
*---------------------------------------------------*/

var express = require('express');
var config = require('./server/configure');
var app= express();
var mongoose = require('mongoose');


app.set('port',process.env.PORT || 3300);
app.set('views',__dirname + '/views');
app = config(app);

/*---------------------------------------------------------------------------
* This will create a database on our machine inside mongodb named as - iot
*---------------------------------------------------------------------------*/
mongoose.connect("mongodb://localhost/iot");
mongoose.connection.on('open',function(){
	console.log("Mongoose Connected");
});

//Create a HTTP server
app.listen(app.get('port'),function(){
	console.log('Server up: http://localhost:'+app.get('port'));
});

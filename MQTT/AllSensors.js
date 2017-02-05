var mqtt = require('mqtt'),
        client = mqtt.connect('mqtt://192.168.43.201');
var JSON = require('JSON');
var http = require('http'),
        querystring = require('querystring');


var dhtsensor = require('node-dht-sensor');       //dht22 

const sensor = require('ds18b20-raspi');      //DS18B20
var gpio = require('pi-gpio');


var ads1x15 = require('node-ads1x15');       //Soil
var chip = 1;                                //0 for ads1015, 1 for ads1115
var adc = new ads1x15(chip);                  //Simple usage (default ADS address on pi 2b or 3):
var adc = new ads1x15(chip, 0x48, 'dev/i2c');  // Optionally i2c address as (chip, address) or (chip, address, i2c_dev)

var channel = 0;                
var samplesPerSecond = '250';
var progGainAmp = '4096';                     //Soil


deviceId = '28-0316013b68ff';                       //DS18B20
var ready=false;
gpio.open(12, "output", function()
      {
              console.log("Led exported");
               ready=true;
      });                                           //DS18B20
gpio.write(12, 1, function() {                 // Set pin 12 high (1)
                     console.log("Wrote 1 after open");
                     });


var MqttData;
var Connected=false;

//---------------------------------------------------------------------------------------
setInterval( function(){

//Read Data from the Sensor DHT22 and Publish to MQTT
dhtsensor.read(22, 27, function(err, temperature, humidity) {

        if (!err) {

                console.log('Humidity: ' + humidity.toFixed(1) + '%');

                //MQTT Data
                MqttData ="{Data: " + humidity.toFixed(1) +", Device:'ln9m33q'}";
                if(Connected)
                        client.publish('hello',MqttData);
        }

});
//------------------------------------------------------------------------------------------
        //Read Data from the Sensor Soil Sensor and Publish to MQTT
        var reading=0;                                            //somewhere to store our reading
        if(!adc.busy)
        {
                adc.readADCSingleEnded(channel, progGainAmp, samplesPerSecond, function(err, data) {

                if(err)
                        throw err;
                console.log(data);

                //MQTT Data
                MqttData ="{Data:" +data+",Device:'amypg31'}";
                if(Connected)
                        client.publish('hello',MqttData);
                });
        }
//----------------------------------------------------------------------------------------
         //Read Data from the Sensor DS18b20 and Publish to MQTT
     
                 const temp = sensor.readC(deviceId, 2);
                 console.log(temp);
                         
                 gpio.read(12, function(err,val) {               
                 console.log("Pin values"+val);     
                 });

                 if(temp > 30)
                {
                    if(ready)
                    {
                         gpio.write(12, 0, function() {          //  Set pin 12 low (0)               
                         console.log("In write");                     
                     });

                }
                }
                else
                { 
                     gpio.write(12, 1, function() {                 // Set pin 12 high (1)           
                     console.log("Wrote 1");                  
                     });
                }
                    //MQTT Data
                MqttData ="{Data: " +temp +", Device:'5qubaek'}";
                if(Connected)
                        client.publish('hello',MqttData);



},5000);



//Connect callback for MQTT
client.on('connect', function(){
        console.log('MQTT Broker connected');
        Connected = true;
});




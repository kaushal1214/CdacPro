/*
 Basic ESP8266 MQTT example

 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.

 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.

 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.

const char* ssid = "Xperia";
const char* password = "";
const char* mqtt_server = "192.168.43.201";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
int state1=0,state2=0;

int led1=5;
int led2=4,led3=0,led4=2;
void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  //Message is in the form (Switch no,State)Eg:
      //To on Switch 1-->(1,1)
      //To off Switch 2-->(2,0)
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
 
    
   
 
  //payload[0]=Switch no && payload[1]=',' && payload[2]=State
  // Switch on the LED if an 1 was received as first character
  if ((char)payload[2] == '1') {
         Serial.print("In if loop if on state");

    char ch=((char)payload[0]);
    switch(ch)
    {
    case '1':digitalWrite(led1, HIGH);
             Serial.print((char)payload[0]);
            break;
    case '2':digitalWrite(led2, HIGH);
            Serial.print((char)payload[0]);
            break;
    case '3':digitalWrite(led3, HIGH);
            Serial.print((char)payload[0]);
            break;
    case '4':digitalWrite(led4, HIGH);
            Serial.print((char)payload[0]);
            break;
    default: Serial.print("Invalid pin number");
               break;     
    }
     
  //  client.publish("outTopic", "{\"Switch\""+":"+(char)payload[0]+",\"State\":1}");
  } else if ((char)payload[2] == '0'){
   // digitalWrite(BUILTIN_LED, LOW);
     char ch=((char)payload[0]);
     Serial.print("In else loop if off state");
    switch(ch)
    {
    case '1':digitalWrite(led1, LOW);
    Serial.print((char)payload[0]);
   
            break;
   case '2':digitalWrite(led2, LOW);
    Serial.print((char)payload[0]);
            break;
  case '3':digitalWrite(led3, LOW);
    Serial.print((char)payload[0]);
            break;
    case '4':digitalWrite(led4, LOW);
    Serial.print((char)payload[0]);
            break;
   default: Serial.print("Invalid pin number");
               break;     
    }
//client.publish("outTopic", "Relay"+(char)payload[0]+"is off");
//client.publish("outTopic", "{\"Switch\""+":"+(char)payload[0]+",\"State\":0}");
    
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
   


     
      client.subscribe("hello");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
   Serial.println(" b");
  pinMode(led1, OUTPUT); 
   Serial.println(" a"); 
 pinMode(led2, OUTPUT);
 pinMode(led3, OUTPUT);
  pinMode(led4, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();


}


/*void publish_function()
{


    Serial.print( digitalRead(5));
    if( digitalRead(5)== HIGH)
    client.publish("hello", "Actuator-Pump1:ON");
    else
     client.publish("hello", "Actuator-Pump1:OFF");
    

    Serial.print(digitalRead(0));
    if(digitalRead(0)==HIGH)
    client.publish("hello", "Actuator-Ventilator:ON");
    else
     client.publish("hello", "Actuator-Ventilator:OFF");
  
}*/


package com.example.wicked.websockets;

import android.app.Activity;
import android.app.Dialog;
import android.app.TabActivity;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.method.LinkMovementMethod;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;

public class MainActivity extends AppCompatActivity {
    TextView soilDisplay, tempDisplay, humDisplay;

    WebSocketClient client;
    ToggleButton Pump, Ventilator;
    boolean PUMP, VENTILATOR;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //sensor Data textviews
        soilDisplay = (TextView)findViewById(R.id.tvSoilData);
        tempDisplay = (TextView)findViewById(R.id.tvTempData);
        humDisplay = (TextView)findViewById(R.id.tvHumidityData);

        //Actuator textview


        //ToggleButton
        Pump = (ToggleButton)findViewById(R.id.tgSoil);
        Ventilator = (ToggleButton)findViewById(R.id.tgHumi);

        Pump.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked)
                {
                    Toast.makeText(MainActivity.this,"Pump is turning 'ON'", Toast.LENGTH_LONG).show();
                    PUMP = true;
                    client.send("Actuator-Pump1:ON");

                }
                else
                {
                    Toast.makeText(MainActivity.this,"Pump is now 'OFF'", Toast.LENGTH_LONG).show();
                    PUMP = false;
                    client.send("Actuator-Pump1:OFF");
                }
            }
        });

        Ventilator.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked)
                {
                    Toast.makeText(MainActivity.this,"Ventilator is turning 'ON'", Toast.LENGTH_LONG).show();
                    VENTILATOR = true;
                    client.send("Actuator-Ventilator1:ON");

                }
                else
                {
                    Toast.makeText(MainActivity.this,"Ventilator is now 'OFF'", Toast.LENGTH_LONG).show();
                    VENTILATOR = false;
                    client.send("Actuator-Ventilator1:OFF");
                }
            }
        });

        //Tabs defination
        TabHost tabs = (TabHost)findViewById(R.id.tabhost);
        tabs.setup();

        //Soil Sensor Tab
        TabHost.TabSpec tab1 = tabs.newTabSpec("tab1");
        tab1.setIndicator("Soil Sensor");
        tab1.setContent(R.id.tab1);
        tabs.addTab(tab1);

        //Temp Sensor Tab
        TabHost.TabSpec tab2 = tabs.newTabSpec("tab2");
        tab2.setIndicator("Temp Sensor");
        tab2.setContent(R.id.tab2);
        tabs.addTab(tab2);

        //Humidity Sensor Tab
        TabHost.TabSpec tab3 = tabs.newTabSpec("tab3");
        tab3.setIndicator("Humidity Sensor");
        tab3.setContent(R.id.tab3);
        tabs.addTab(tab3);

    }

    public void onConnect(View v)
    {
        EditText socket = (EditText)findViewById(R.id.etsocket);
        URI uri;

        try {
            uri = new URI(socket.getText().toString());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }

        client = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake handshakedata) {
                client.send("Hello from " + Build.MANUFACTURER + " " + Build.MODEL);
            }

            @Override
            public void onMessage(final String message) {

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        //Data format ==> "Data-Soil:34"; Temp:34 ; Humid:78
                        

                        String header[] = message.split("-");
                        if(header[0].contentEquals("Data")) {
                            String data[] = header[1].split(":");
                            if(data[0].contentEquals("Soil")) {
                                soilDisplay.setText(data[1]);
                                float value = Float.parseFloat(data[1]);

                                //Pump: Turn On : Value >3000
                                if(value>3000)
                                {
                                    alertDialog("Soil Moisture","It seems your field soil is running out of water. Please Turn On the Pump.");
                                }
                            }
                            else if(data[0].contentEquals("Temp"))
                                tempDisplay.setText(data[1] + "'C");
                            else if (data[0].contentEquals("Humid")) {
                                humDisplay.setText(data[1] + "%");
                                float value = Float.parseFloat(data[1]);

                                //Ventilator: Turn On for : value> 70
                                if (value >70 ) {
                                    alertDialog("Humidity","The air is really humid. Please Turn On the Ventilator.");
                                }

                            }
                            else
                                Toast.makeText(MainActivity.this,"Not Applicable",Toast.LENGTH_LONG).show();
                        }



                    }
                });

            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                //         Toast.makeText(MainActivity.this,"Connection closed",Toast.LENGTH_LONG).show();
            }

            @Override
            public void onError(Exception ex) {
                //       Toast.makeText(MainActivity.this,"Some Error",Toast.LENGTH_LONG).show();
            }
        };
        client.connect();

    }

    private void alertDialog(String title, String msg) {
        AlertDialog.Builder ad = new AlertDialog.Builder(this);
        ad.setTitle(title);
        ad.setMessage(msg);
        ad.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });
        ad.show();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main2,menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId())
        {
            case R.id.action_settings:
                Dialog d = new Dialog(this);
                d.setTitle("Github Link");
                TextView tv = new TextView(this);
                tv.setText("This project is hosted on: \n https://github.com/kaushal1214/CdacPro");
                tv.setTextSize(20);
                tv.setAutoLinkMask(1);
                tv.setMovementMethod(LinkMovementMethod.getInstance());
                d.setContentView(tv);
                d.show();
                                        return true;


            default:
                    return super.onOptionsItemSelected(item);
        }
    }
}

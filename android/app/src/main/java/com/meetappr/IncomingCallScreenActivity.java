package com.meetappr;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.RequiresApi;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import java.util.Iterator;
import java.util.List;



public class IncomingCallScreenActivity extends ReactActivity {

    private static final String TAG = "MessagingService";
    private Ringtone ringtone;
    LocalBroadcastManager mLocalBroadcastManager;
    BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if(intent.getAction().equals("com.incomingcallscreenactivity.action.close")){
                finish();
            }
        }
    };
    @RequiresApi(api = Build.VERSION_CODES.P)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mLocalBroadcastManager = LocalBroadcastManager.getInstance(this);
        IntentFilter mIntentFilter = new IntentFilter();
        mIntentFilter.addAction("com.incomingcallscreenactivity.action.close");
        mLocalBroadcastManager.registerReceiver(mBroadcastReceiver, mIntentFilter);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        setContentView(R.layout.incoming_call_activity);

        Intent intent = getIntent();
        String call_type=intent.getStringExtra("MESSAGE_TYPE");
        String incomingCallDisconnect="calldisconnected";
        String incomingCallStart="incomingcall";
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        String notifMessageType = sharedPref.getString("NOTIF_MESSAGE_TYPE", "incomingcall");

        //ringtoneManager start
        Uri incoming_call_notif = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
        // this.ringtone= RingtoneManager.getRingtone(getApplicationContext(), incoming_call_notif);
        //ringtoneManager end

        if(notifMessageType.equals(incomingCallStart)){
                // ringtone.setLooping(true);
                // ringtone.play();
        }
        else if(notifMessageType.equals(incomingCallDisconnect)){
                finish();
        }

        String host_name = intent.getStringExtra("CALLER_NAME");
        String incoming_call_type=intent.getStringExtra("CALL_TYPE");
        Boolean isAppRuning=intent.getBooleanExtra("APP_STATE",false);

        TextView tvName = (TextView)findViewById(R.id.callerName);
        tvName.setText(host_name);

        //

        final ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();

         ImageButton acceptCallBtn = (ImageButton) findViewById(R.id.accept_call_btn);
        acceptCallBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("done", true);
                params.putString("call_type",incoming_call_type);

                if(isAppRuning){
                  sendEvent(reactContext, "accept", params);
               
                    // Intent intent = new Intent(IncomingCallScreenActivity.this, MainActivity.class);
                    // intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                    // intent.putExtra("CALL_TYPE",incoming_call_type);
                    finish();
                    // startActivity(intent);
                }
            else{
                    sendEvent(reactContext, "accept", params);
                    Intent intent = new Intent(IncomingCallScreenActivity.this, MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                    intent.putExtra("CALL_TYPE",incoming_call_type);
                    startActivity(intent);
                    finish();
                }
            }
        });

        ImageButton rejectCallBtn = (ImageButton) findViewById(R.id.reject_call_btn);
        rejectCallBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("done", true);
                params.putString("call_type",incoming_call_type);
                onDisconnected();
                if(isAppRuning){
                  sendEvent(reactContext, "reject", params);
        
                    // Intent intent = new Intent(IncomingCallScreenActivity.this, MainActivity.class);
                    // intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY );
                    // intent.putExtra("CALL_TYPE",incoming_call_type);
                    finish();
                    // startActivity(intent);
                }
                else{
                    sendEvent(reactContext, "reject", params);
                    Intent intent = new Intent(IncomingCallScreenActivity.this, MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                    intent.putExtra("CALL_TYPE",incoming_call_type);
                    startActivity(intent);
                    finish();
                }
            }
        });

        Handler handler = new Handler();

        handler.postDelayed(new Runnable() {
            public void run() {
                finish();
            }
        }, 45000);

    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        mLocalBroadcastManager.unregisterReceiver(mBroadcastReceiver);
        // ringtone.stop();
    }

    private void onDisconnected() {
//do something
    }

    private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}

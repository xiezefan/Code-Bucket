package com.xiezefan.segmentfault.app;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

/**
 * Created by ZeFanXie on 14-11-28.
 */
public class VolleyActivity extends Activity {

    private TextView mTextView;
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.volley_activity);

        this.mTextView = (TextView) findViewById(R.id.textView);
        this.mContext = this;

    }

    public void requestJSON(View view) {

    }

    public void request(View view) {
        RequestQueue queue = Volley.newRequestQueue(mContext);
        String url ="http://xiezefan.qiniudn.com/test.json";

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                mTextView.setText("Response is: "+ response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                mTextView.setText("That didn't work!");
            }
        });

        queue.add(stringRequest);

    }
}

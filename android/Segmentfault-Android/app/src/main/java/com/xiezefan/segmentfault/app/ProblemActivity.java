package com.xiezefan.segmentfault.app;

import android.app.ActionBar;
import android.app.Activity;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ListView;
import com.xiezefan.segmentfault.app.adapter.AnswerListAdapter;

/**
 * Created by xiezefan-pc on 2014/11/24.
 */
public class ProblemActivity extends Activity {
    private static final String TAG = ProblemActivity.class.getSimpleName();

    private ListView mAnswerList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.problem);

        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);
        ab.setHomeButtonEnabled(true);


        this.mAnswerList = (ListView) findViewById(R.id.answer_list);
        mAnswerList.setAdapter(new AnswerListAdapter(this));
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;
            default:
                return true;
        }
    }
}

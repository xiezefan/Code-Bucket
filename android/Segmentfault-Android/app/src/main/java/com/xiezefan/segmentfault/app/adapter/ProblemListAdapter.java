package com.xiezefan.segmentfault.app.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import com.xiezefan.segmentfault.app.R;

/**
 * Created by xiezefan-pc on 2014/11/23.
 */
public class ProblemListAdapter extends BaseAdapter {
    private Context mContext;
    private LayoutInflater mInflater;

    public ProblemListAdapter(Context context) {
        this.mContext = context;
        this.mInflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return 10;
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if (view == null) {
            view = mInflater.inflate(R.layout.problem_list_item, null);
            // TODO set data
        }
        return view;
    }
}

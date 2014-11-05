package org.easyim.wechatdemo.app;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;
import com.hb.views.PinnedSectionListView;

/**
 * Created by xiezefan-pc on 2014/11/1.
 */
public class ContactsFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View currentView = inflater.inflate(R.layout.contacts_fragment, container, false);
        PinnedSectionListView listView = (PinnedSectionListView) currentView.findViewById(R.id.list);
        listView.setAdapter(new ContactListAdapter(getActivity()));
        return inflater.inflate(R.layout.contacts_fragment, container, false);
    }


}

package org.easyim.wechatdemo.app;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import com.hb.views.PinnedSectionListView;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ZeFanXie on 14-11-5.
 */
public class ContactListAdapter extends BaseAdapter implements PinnedSectionListView.PinnedSectionListAdapter {
    private LayoutInflater inflater = null;
    private List<ListItem> items;

    public ContactListAdapter(Context context) {
        inflater = LayoutInflater.from(context);
        items = new ArrayList<ListItem>();
        for (int i=1; i<=100; i++) {
            if (i % 5 == 0) {
                items.add(new ListItem(i + "", "Group" + (i % 5 + 1), false));
            } else {
                items.add(new ListItem(i + "", "Item" + i, true));
            }
        }
     }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public Object getItem(int position) {
        return items.get(position);
    }

    @Override
    public long getItemId(int position) {
        return items.get(position).id.hashCode();
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ListItem item = items.get(position);
        if(convertView == null) {
            if (item.isPinned) {
                convertView = inflater.inflate(R.layout.contacts_list_group, null);
            } else {
                convertView = inflater.inflate(R.layout.contacts_list_item, null);
            }
        }

        TextView textView = (TextView) convertView.findViewById(R.id.text);
        textView.setText(items.get(position).name);



        return convertView;

    }

    @Override
    public boolean isItemViewTypePinned(int viewType) {
        return items.get(viewType).isPinned;
    }

    @Override
    public int getItemViewType(int position) {
        return position;
    }

    @Override
    public int getViewTypeCount() {
        return 3;
    }

    public static class ListItem {
        public ListItem(String id, String name, boolean isPinned) {
            this.id = id;
            this.name = name;
            this.isPinned = isPinned;
        }

        public String id;
        public String name;
        public boolean isPinned;
    }
}

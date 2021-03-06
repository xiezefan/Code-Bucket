package com.xiezefan.segmentfault.app;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.*;
import com.ikimuhendis.ldrawer.ActionBarDrawerToggle;
import com.ikimuhendis.ldrawer.DrawerArrowDrawable;
import com.xiezefan.segmentfault.app.adapter.ProblemListAdapter;
import uk.co.senab.actionbarpulltorefresh.library.ActionBarPullToRefresh;
import uk.co.senab.actionbarpulltorefresh.library.PullToRefreshLayout;
import uk.co.senab.actionbarpulltorefresh.library.listeners.OnRefreshListener;


public class MainActivity extends Activity {
    private static final String Tag = MainActivity.class.getSimpleName();
    // 侧滑菜单
    private DrawerLayout mDrawerLayout;
    //private ListView mDrawerList;
    // 菜单按钮
    private ActionBarDrawerToggle mDrawerToggle;
    // 菜单监听器
    private DrawerArrowDrawable drawerArrow;

    private Context mContext;

    // 下拉刷新Layout
    private PullToRefreshLayout mPullToRefreshLayout;

    private ListView mProblemList;

    private LinearLayout mLeftBar;
    private ListView mLeftBarMenu;
    //private RoundedImageView mBarAvatar;

    public MainActivity() {
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mContext = this;

        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);
        ab.setHomeButtonEnabled(true);

        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        //mDrawerList = (ListView) findViewById(R.id.navdrawer);
        mPullToRefreshLayout = (PullToRefreshLayout) findViewById(R.id.ptr_layout);
        mProblemList = (ListView) findViewById(R.id.article_list);
        mLeftBar = (LinearLayout) findViewById(R.id.left_nav_bar);
        mLeftBarMenu = (ListView) findViewById(R.id.left_bar_menu);

        ActionBarPullToRefresh.from(this)
                // Mark All Children as pullable
                .allChildrenArePullable()
                        // Set a OnRefreshListener
                .listener(new OnRefreshListener() {
                    @Override
                    public void onRefreshStarted(View view) {

                        Log.d(Tag, "[onCreate] on refresh started execute");
                    }
                })

                // Finally commit the setup to our PullToRefreshLayout
                .setup(mPullToRefreshLayout);

        drawerArrow = new DrawerArrowDrawable(this) {
            @Override
            public boolean isLayoutRtl() {
                return false;
            }
        };
        mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout,
                drawerArrow, R.string.drawer_open,
                R.string.drawer_close) {

            public void onDrawerClosed(View view) {
                super.onDrawerClosed(view);
                invalidateOptionsMenu();
            }

            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                invalidateOptionsMenu();
            }
        };
        mDrawerLayout.setDrawerListener(mDrawerToggle);
        mDrawerToggle.syncState();


        final String[] values = new String[]{
                "最新的",
                "热门的",
                "一起涨姿势",
                "推荐文章",
                "热门文章",
                "榜单"
        };

        // 左滑菜单列表
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, android.R.id.text1, values);
        mLeftBarMenu.setAdapter(adapter);
        mLeftBarMenu.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Toast.makeText(mContext, values[position], Toast.LENGTH_SHORT).show();
            }
        });
        //mDrawerList.setAdapter(adapter);
        /*mDrawerList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Toast.makeText(mContext, values[position], Toast.LENGTH_SHORT).show();
            }
        });*/



        mProblemList.setAdapter(new ProblemListAdapter(mContext));
        mProblemList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent intent = new Intent();
                intent.setClass(mContext, ProblemActivity.class);
                startActivity(intent);
            }
        });


    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        if (item.getItemId() == android.R.id.home) {
            if (mDrawerLayout.isDrawerOpen(mLeftBar)) {
                mDrawerLayout.closeDrawer(mLeftBar);
            } else {
                mDrawerLayout.openDrawer(mLeftBar);
            }
        }
        return super.onOptionsItemSelected(item);
    }
}

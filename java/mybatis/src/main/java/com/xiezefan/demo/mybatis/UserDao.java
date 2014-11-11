package com.xiezefan.demo.mybatis;

import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by ZeFanXie on 14-11-6.
 */
public interface UserDao {
    public List<User> queryUsers(User user);

    public void save(User user);

    public User findById(String id);
}

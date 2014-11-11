package com.xiezefan.demo.mybatis;

/**
 * Created by ZeFanXie on 14-11-11.
 */
public interface BookDao {
    public void save(Book book);
    public void findById(String id);
}

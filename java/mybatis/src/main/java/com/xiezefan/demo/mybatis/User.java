package com.xiezefan.demo.mybatis;

import java.util.List;

/**
 * Created by ZeFanXie on 14-11-5.
 */
public class User {
    private String id;
    private String username;
    private List<Book> books;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}

package com.xiezefan.demo.mybatis;

/**
 * Created by ZeFanXie on 14-11-11.
 */
public class Book {
    private String id;
    private String name;
    private String owner_id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }
}

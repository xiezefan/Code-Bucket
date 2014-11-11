package com.xiezefan.demo.mybatis;

/**
 * Created by ZeFanXie on 14-11-11.
 */
public class Car {
    private String id;
    private String name;
    private User owner;

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}

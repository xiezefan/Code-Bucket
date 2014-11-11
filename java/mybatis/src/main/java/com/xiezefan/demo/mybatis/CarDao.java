package com.xiezefan.demo.mybatis;

import org.apache.ibatis.annotations.Insert;

public interface CarDao {
    public void save(Car car);
    public Car findById(String id);
}

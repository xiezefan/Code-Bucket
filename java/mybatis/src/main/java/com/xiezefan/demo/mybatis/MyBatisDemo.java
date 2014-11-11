package com.xiezefan.demo.mybatis;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.Reader;
import java.util.List;
import java.util.UUID;

/**
 * Created by ZeFanXie on 14-11-5.
 */
public class MyBatisDemo {
    private static SqlSessionFactoryBuilder sqlSessionFactoryBuilder;
    private static SqlSessionFactory sqlSessionFactory;

    private static void init() throws IOException {
        String resource = "mybatis-config.xml";
        Reader reader = Resources.getResourceAsReader(resource);
        sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        sqlSessionFactory = sqlSessionFactoryBuilder.build(reader);
    }

    private static void queryUser() {
        SqlSession session = null;
        try {
            session = sqlSessionFactory.openSession();
            UserDao userDao = session.getMapper(UserDao.class);
            User user = new User();
            user.setUsername("xiezefan");
            List<User> users = userDao.queryUsers(user);
            if (null != users) {
                // Mybatis的日志级别竟然没得info，只好用error代替了
                System.out.println(users.get(0).toString());
            }
            session.commit(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




    public static void saveUser() throws Exception {
        SqlSession session = sqlSessionFactory.openSession();
        UserDao userDao = session.getMapper(UserDao.class);
        User user = new User();
        user.setId("123456");
        user.setUsername("xiezefan");
        userDao.save(user);
        session.commit(true);
        System.out.println("success");
    }

    public static void findUserById() {
        SqlSession session = sqlSessionFactory.openSession();
        UserDao userDao = session.getMapper(UserDao.class);

        User user = userDao.findById("123456");
        System.out.println(user.getUsername());
        System.out.println(user.getBooks());
    }

    public static void saveCar() throws Exception {
        SqlSession session = sqlSessionFactory.openSession();
        CarDao carDao = session.getMapper(CarDao.class);

        User user = new User();
        user.setId("123456");
        user.setUsername("xiezefan");

        Car car = new Car();
        car.setId(UUID.randomUUID().toString());
        car.setName("Bugatti Veyron");
        car.setOwner(user);

        carDao.save(car);

        session.commit();

        System.out.println("success");
    }

    public static void findCarById() {
        SqlSession session = sqlSessionFactory.openSession();
        CarDao carDao = session.getMapper(CarDao.class);
        Car car = carDao.findById("26145725-7cac-4c3d-a8ee-88aa484675e1");
        System.out.println(car.getOwner().getUsername());
    }

    public static void saveBook() {
        SqlSession session = sqlSessionFactory.openSession();
        BookDao bookDao = session.getMapper(BookDao.class);

        for (int i=5; i<10; i++) {
            Book book = new Book();
            book.setId(UUID.randomUUID().toString());
            book.setName("Book" + (i + 1));
            book.setOwner_id("123456");
            bookDao.save(book);
        }

        session.commit(true);
        System.out.println("success");
    }

    public static void main(String[] args) throws Exception {
        init();
        findUserById();
    }



}

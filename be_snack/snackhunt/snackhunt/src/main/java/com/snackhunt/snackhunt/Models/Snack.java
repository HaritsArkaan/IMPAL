package com.snackhunt.snackhunt.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;


@Document(collection = "snacks")
public class Snack {
    
    @Transient
    public static final String SEQUENCE_NAME = "snack_sequence";

    @Id
    private int id;
    private String name;
    private int price;
    private String image;
    private String image_URL;
    private String seller;
    private String contact;
    private String location;
    private double rating;
    private String type;
    private int userId;

    public Snack(){}



    public Snack(int id, String name, int price, String image, String image_URL, String seller, String contact, String location, double rating, String type, int userId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.image_URL = image_URL;
        this.seller = seller;
        this.contact = contact;
        this.location = location;
        this.rating = rating;
        this.type = type;
        this.userId = userId;
    }


    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return this.price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getImage_URL() {
        return this.image_URL;
    }

    public void setImage_URL(String image_URL) {
        this.image_URL = image_URL;
    }

    public String getSeller() {
        return this.seller;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public String getContact() {
        return this.contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getRating() {
        return this.rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getUserId() {
        return this.userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
    
}
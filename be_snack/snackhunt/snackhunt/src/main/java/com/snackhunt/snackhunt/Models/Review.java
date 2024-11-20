package com.snackhunt.snackhunt.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Transient;

@Document(collection = "reviews")
public class Review {
    
    @Transient
    public static final String SEQUENCE_NAME = "reviews_sequence";

    @Id
    private int id;
    private String content;
    private float rating;
    private int userId;
    private int snackId;

    public Review(){}


    public Review(int id, String content, float rating, int userId, int snackId) {
        this.id = id;
        this.content = content;
        this.rating = rating;
        this.userId = userId;
        this.snackId = snackId;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    public float getRating() {
        return this.rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public int getUserId() {
        return this.userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getSnackId() {
        return this.snackId;
    }

    public void setSnackId(int snackId) {
        this.snackId = snackId;
    }

}

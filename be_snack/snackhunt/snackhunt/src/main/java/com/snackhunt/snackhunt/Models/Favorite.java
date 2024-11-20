package com.snackhunt.snackhunt.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;


@Document(collection = "favorities")
public class Favorite {

    @Transient
    public static final String SEQUENCE_NAME = "favorities_sequence";

    @Id
    private  int id;
    private int userId;
    private int snackId;


    public Favorite() {
    }

    public Favorite(int id, int userId, int snackId) {
        this.id = id;
        this.userId = userId;
        this.snackId = snackId;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
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

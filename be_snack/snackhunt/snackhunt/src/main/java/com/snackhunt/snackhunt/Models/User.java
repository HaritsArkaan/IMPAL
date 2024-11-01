package com.snackhunt.snackhunt.Models;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "User")
public class User {
    private int id;

    private String username;
    private String password;
    private String email;
    private String pfp;
    private String image_URL;

    // Getter dan Setter
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPfp() {
        return this.pfp;
    }

    public void setPfp(String pfp) {
        this.pfp = pfp;
    }

    public String getImage_URL() {
        return this.image_URL;
    }

    public void setImage_URL(String image_URL) {
        this.image_URL = image_URL;
    }

}

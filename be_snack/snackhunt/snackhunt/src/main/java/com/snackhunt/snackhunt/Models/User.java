package com.snackhunt.snackhunt.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;
import org.springframework.security.core.userdetails.UserDetails;

@Document(collection = "users")
public class User {

    @Transient
    public static final String SEQUENCE_NAME = "user_sequence";
    
    @Id
    protected int id;
    protected String username;
    protected String password;
    protected Role role;


    public User(){}


    public User(int id, String username, String password, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

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


    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


}

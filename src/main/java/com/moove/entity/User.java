package com.moove.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@Entity
@Getter
@Setter

@Table(name = "users")
public class User {

    @Id
    private String userId;

    // Generate UUID in constructor or @PrePersist
    @PrePersist
    public void generateId() {
        if (this.userId == null) {
            this.userId = UUID.randomUUID().toString();
        }
    }


    private String username;
    private String userEmail;
    private String userPhone;
    private String userAddress;
    private String userPassword;
    private String userRole;


    public User() {

    }
}

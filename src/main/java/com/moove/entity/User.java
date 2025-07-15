package com.moove.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Entity
@Getter
@Setter


public class User {

    @Id
    private String userId;

    private String username;
    private String userEmail;
    private String userPhone;
    private String userAddress;


    public User() {

    }
}

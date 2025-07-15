package com.moove.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "users")

public class User {

    @Id
    private String userId;

    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAddress;


    public User() {

    }
}

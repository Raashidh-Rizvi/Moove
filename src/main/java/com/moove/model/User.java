package com.moove.model;

import jakarta.persistence.*;
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

    private String username;
    private String userEmail;
    private String userPhone;
    private String userAddress;
    @ManyToOne
    @JoinColumn
    private Store store;


    public User() {

    }
}

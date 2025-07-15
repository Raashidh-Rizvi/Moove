package com.moove;

import com.moove.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor

public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long storeId;

    // Assuming one user owns many shops
    @ManyToOne
    @JoinColumn
    private User user;

    private String storeName;
    private String storeAddress;
    private String storePhone;
    private String storeEmail;
    private String storeDescription;
    private double latitude;
    private double longitude;
    private String storeFeedback;


    public Store() {

    }
}

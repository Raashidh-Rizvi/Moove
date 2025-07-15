package com.moove.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;

@AllArgsConstructor
@Entity
@Getter
@Setter

public class Property {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long propertyId;

        @ManyToOne
        @JoinColumn(name = "user_Id", nullable = false)
        private User user;


        private String propertyName;
        private String propertyDescription;
        private double propertyPrice=0;
        private String propertyType; // APARTMENT, HOUSE, ROOM
        private double propertySize=0; // in sqft or sqm
        private int bedroomsAvailable=0;
        private int bathroomsAvailable=0;


        @Lob
        private String propertyImageUrl;
        private String propertyReview;


        public Property() {

        }

        @OneToMany(mappedBy = "property")
        private Collection<Review> review;

}

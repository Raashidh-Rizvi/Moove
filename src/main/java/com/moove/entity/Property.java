package com.moove.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Entity
@Getter
@Setter

public class Property {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int propertyId;
        @ManyToOne
        @JoinColumn
        private User user;

        @Id @GeneratedValue
        private Long id;

        private String propertyName;
        private String description;
        private double price;
        private String type; // APARTMENT, HOUSE, ROOM
        private double size; // in sqft or sqm
        private int bedrooms;
        private int bathrooms;


        @Lob
        private String imageUrl;
        private String propertyFeedback;


        public Property() {

        }
}

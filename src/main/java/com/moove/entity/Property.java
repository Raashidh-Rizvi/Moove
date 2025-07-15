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
        @JoinColumn
        private User user;


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

        @OneToMany(mappedBy = "property")
        private Collection<Review> review;

        public Collection<Review> getReview() {
                return review;
        }

        public void setReview(Collection<Review> review) {
                this.review = review;
        }
}

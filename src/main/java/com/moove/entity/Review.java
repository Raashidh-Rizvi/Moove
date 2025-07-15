package com.moove.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor

@Entity
public class Review {
    @Id
    @GeneratedValue
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "users_user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public Review() {

    }
}

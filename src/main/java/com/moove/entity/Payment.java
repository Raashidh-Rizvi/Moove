package com.moove.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Payment {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Booking booking;

    private double amount;
    private String paymentMethod; // STRIPE, etc.
    private String status; // PAID, FAILED, REFUNDED

    private LocalDateTime paidAt;
}

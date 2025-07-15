package com.moove.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor

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

    public Payment() {

    }
}

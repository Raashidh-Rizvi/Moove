package com.moove.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private User user;


    private Double totalAmount;
    private Date bookingDate;
    private Date checkInDate;
    private Time checkInTime;
    private Time checkOutTime;
    private Date checkOutDate;
    private boolean checkedByOwner;
    private boolean conformedByOwner;
    private String status;



    public Booking() {

    }
}



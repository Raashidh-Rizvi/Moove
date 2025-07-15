package com.moove.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor

public class Location {
    private String address;
    private String city;
    private double lat;
    private double lng;

    public Location() {

    }
}

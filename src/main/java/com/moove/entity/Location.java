package com.moove.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {
    private String address;
    private String city;
    private double lat;
    private double lng;
}

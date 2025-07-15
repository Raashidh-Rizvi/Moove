package com.moove.repository;

import com.moove.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.property.propertyId = :propertyId")
    List<Review> findByPropertyId(@Param("propertyId") Long propertyId);


}
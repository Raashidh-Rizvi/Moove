package com.moove.repository;


import com.moove.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByPropertyId(int propertyId);

    @Query("SELECT p FROM Property p WHERE p.store.storeId = :storeId")
    List<Property> findPropertyByStoreId(@Param("storeId") Long storeId);

}

package com.moove.service;

import com.moove.entity.Property;
import com.moove.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public Property addProperty(Property property) {
        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getPropertyById(Long propertyId) {
        return propertyRepository.findById(propertyId);
    }

    public void deleteProperty(Long propertyId) {
        propertyRepository.deleteById(propertyId);
    }
}

package com.moove.service;

import com.moove.entity.Review;
import com.moove.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getByPropertyId(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId);
    }

    public Review save(Review review) {
        return reviewRepository.save(review);
    }
}
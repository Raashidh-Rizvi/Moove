package com.moove.service;

import com.moove.entity.Review;
import com.moove.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // ✅ Create a review
    public Review save(Review review) {
        review.setCreatedAt(LocalDateTime.now()); // set timestamp
        return reviewRepository.save(review);
    }

    // ✅ Get all reviews
    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    // ✅ Get review by ID
    public Optional<Review> getById(Long id) {
        return reviewRepository.findById(id);
    }

    // ✅ Get reviews by Property ID
    public List<Review> getByPropertyId(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId);
    }

    // ✅ Update review
    public Optional<Review> update(Long id, Review updatedReview) {
        return reviewRepository.findById(id).map(existingReview -> {
            existingReview.setRating(updatedReview.getRating());
            existingReview.setComment(updatedReview.getComment());
            existingReview.setUser(updatedReview.getUser());
            existingReview.setProperty(updatedReview.getProperty());
            return reviewRepository.save(existingReview);
        });
    }

    // ✅ Delete review
    public boolean delete(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

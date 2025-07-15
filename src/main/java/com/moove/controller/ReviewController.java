package com.moove.controller;

import com.moove.entity.Review;
import com.moove.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ✅ Create a new review
    @PostMapping
    public Review create(@RequestBody Review review) {
        return reviewService.save(review);
    }

    // ✅ Get all reviews
    @GetMapping
    public List<Review> getAll() {
        return reviewService.getAll();
    }

    // ✅ Get a review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getById(@PathVariable Long id) {
        Optional<Review> review = reviewService.getById(id);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get all reviews by property ID
    @GetMapping("/property/{propertyId}")
    public List<Review> getByPropertyId(@PathVariable Long propertyId) {
        return reviewService.getByPropertyId(propertyId);
    }

    // ✅ Update a review
    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long reviewId, @RequestBody Review updatedReview) {
        Optional<Review> review = reviewService.update(reviewId, updatedReview);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete a review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long reviewId) {
        boolean deleted = reviewService.delete(reviewId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

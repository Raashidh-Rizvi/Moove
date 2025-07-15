package com.moove.controller;

import com.moove.entity.Review;
import com.moove.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/property/{propertyId}")
    public List<Review> getByProperty(@PathVariable Long propertyId) {
        return reviewService.getByPropertyId(propertyId);
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return reviewService.save(review);
    }
}

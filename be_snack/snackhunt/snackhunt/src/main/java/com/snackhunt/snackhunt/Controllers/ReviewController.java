package com.snackhunt.snackhunt.Controllers;

import com.snackhunt.snackhunt.Services.*;
import com.snackhunt.snackhunt.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;




@RestController
@RequestMapping("reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "Create review", description = "Create review")
    @PostMapping
    public Review createReview(@RequestBody Review review){
        return reviewService.createReview(review);
    }

    @Operation(summary = "Get all reviews", description = "Get all reviews")
    @GetMapping
    public  List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @Operation(summary = "Get review by id", description = "Get review by id")
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable int id) {
        return reviewService.getReviewById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get review by user id", description = "Get review by user id")
    @GetMapping("/user/{id}")
    public List<Review> getReviewByUserId(@PathVariable int id) {
        return reviewService.getReviewsByUserId(id);
    }

    @Operation(summary = "Get review by snack id", description = "Get review by snack id")
    @GetMapping("/snack/{id}")
    public List<Review> getReviewBySnackId(@PathVariable int id) {
        return reviewService.getReviewsBySnackId(id);
    }
    

    @Operation(summary = "Update review by id", description = "Update review by id")
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable int id, @RequestBody Review reviewDetails) {
        Review updateReview = reviewService.updateReview(id, reviewDetails);
        return updateReview != null ? ResponseEntity.ok(updateReview) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete review by id", description = "Delete review by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable int id) {
        return reviewService.deleteReview(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    
}

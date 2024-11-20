package com.snackhunt.snackhunt.Services;
import org.springframework.stereotype.Service;
import com.snackhunt.snackhunt.Models.*;
import com.snackhunt.snackhunt.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Review createReview(Review review){
        review.setId(sequenceGeneratorService.generateSequence(Review.SEQUENCE_NAME));
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews(){
        return reviewRepository.findAll();
    }

    public Optional<Review> getReviewById(int id){
        return reviewRepository.findById(id);
    }

    public Review updateReview(int id, Review reviewDetails){
        return reviewRepository.findById(id).map(review -> {
            review.setContent(reviewDetails.getContent());
            review.setRating(reviewDetails.getRating());
            review.setUserId(reviewDetails.getUserId());
            review.setSnackId(reviewDetails.getSnackId());
            return reviewRepository.save(review);
        }).orElse(null);
    }

    public boolean deleteReview(int id){
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}



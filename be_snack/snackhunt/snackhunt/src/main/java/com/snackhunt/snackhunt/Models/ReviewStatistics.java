package com.snackhunt.snackhunt.Models;

public class ReviewStatistics {
    private int reviewCount;
    private double averageRating;

    public ReviewStatistics(int reviewCount, double averageRating) {
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}

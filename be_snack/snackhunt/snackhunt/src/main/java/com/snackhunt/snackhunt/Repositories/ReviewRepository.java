package com.snackhunt.snackhunt.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.snackhunt.snackhunt.Models.*;

@Repository
public interface ReviewRepository extends MongoRepository<Review, Integer>{    
}

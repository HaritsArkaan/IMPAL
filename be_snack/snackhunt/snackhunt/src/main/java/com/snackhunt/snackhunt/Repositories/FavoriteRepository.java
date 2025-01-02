package com.snackhunt.snackhunt.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.snackhunt.snackhunt.Models.*;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, Integer> {
    public List<Favorite> findByUserId(int userId);
}

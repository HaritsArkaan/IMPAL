package com.snackhunt.snackhunt.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.snackhunt.snackhunt.Models.*;
import java.util.List;



@Repository
public interface SnackRepository extends MongoRepository<Snack, Integer>{
    public List<Snack> findByType(String type);
    public List<Snack> findByUserId(int userId);
}
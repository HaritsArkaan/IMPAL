package com.snackhunt.snackhunt.Repositories;

import com.snackhunt.snackhunt.Models.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, Integer> {
}

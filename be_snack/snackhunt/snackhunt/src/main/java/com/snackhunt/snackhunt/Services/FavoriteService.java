package com.snackhunt.snackhunt.Services;
import org.springframework.stereotype.Service;
import com.snackhunt.snackhunt.Models.*;
import com.snackhunt.snackhunt.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private  SequenceGeneratorService sequenceGeneratorService ;

    public Favorite createFavorite(Favorite favorite){
        favorite.setId(sequenceGeneratorService.generateSequence(Favorite.SEQUENCE_NAME));
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    public Optional<Favorite> getFavoriteById(int id) {
        return favoriteRepository.findById(id);
    }

    public Favorite updateFavorite(int id, Favorite favoriteDetails) {
        return favoriteRepository.findById(id).map(favorite-> {
            favorite.setUserId(favoriteDetails.getUserId());
            favorite.setSnackId(favoriteDetails.getSnackId());
            return favoriteRepository.save(favorite);
        }).orElse(null);
    }

    public  boolean deleteFavorite(int id){
        if (favoriteRepository.existsById(id)) {
            favoriteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

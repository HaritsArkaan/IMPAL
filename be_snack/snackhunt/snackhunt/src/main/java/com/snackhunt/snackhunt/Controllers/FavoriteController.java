package com.snackhunt.snackhunt.Controllers;

import com.snackhunt.snackhunt.Services.*;
import com.snackhunt.snackhunt.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("favorities")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;

    @PostMapping
    public Favorite createFavorite(@RequestBody Favorite favorite) {
        return favoriteService.createFavorite(favorite);
    }

    @GetMapping
    public List<Favorite> getAllFavorites() {
        return favoriteService.getAllFavorites();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Favorite> getFavoriteById(@PathVariable int id) {
        return favoriteService.getFavoriteById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Favorite> updateFavorite(@PathVariable int id, @RequestBody Favorite favoriteDetails) {
        Favorite updateFavorite = favoriteService.updateFavorite(id, favoriteDetails);
        return updateFavorite != null ? ResponseEntity.ok(updateFavorite) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable int id) {
        return favoriteService.deleteFavorite(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

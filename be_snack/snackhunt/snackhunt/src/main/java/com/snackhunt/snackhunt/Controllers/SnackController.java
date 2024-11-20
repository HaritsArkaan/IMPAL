package com.snackhunt.snackhunt.Controllers;

import com.snackhunt.snackhunt.Services.*;
import com.snackhunt.snackhunt.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("snacks")
public class SnackController {
    
    @Autowired
    private SnackService snackService;

    @PostMapping
    public Snack createSnack(@RequestBody Snack snack) {
        return snackService.createSnack(snack);
    }

    @GetMapping
    public List<Snack> getAllSnacks() {
        return snackService.getAllSnacks();
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Snack> getSnackById(@PathVariable int id) {
        return snackService.getSnackById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Snack>> getSnacksByType(@PathVariable String type) {
        System.out.println("Received request for snack type: " + type);
        List<Snack> snacks = snackService.getSnacksByType(type); 
        return ResponseEntity.ok(snacks);
        // try {
        //     List<Snack> snacks = snackService.getSnacksByType(type);
        //     if (snacks.isEmpty()) {
        //         return ResponseEntity.notFound().build();
        //     } else {
        //         return ResponseEntity.ok(snacks);
        //     }
        // } catch (Exception e) {
        //     System.err.println("Error occurred while fetching snacks: " + e.getMessage());
        //     e.printStackTrace();
        //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        // }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Snack> updateSnack(@PathVariable int id, @RequestBody Snack snackDetails) {
        Snack updateSnack = snackService.updateSnack(id, snackDetails);
        return updateSnack != null ? ResponseEntity.ok(updateSnack) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnack(@PathVariable int id) {
        return snackService.deleteSnack(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

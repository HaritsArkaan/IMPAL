package com.snackhunt.snackhunt.Services;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.snackhunt.snackhunt.Models.*;
import com.snackhunt.snackhunt.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SnackService {
    
    @Autowired
    private SnackRepository snackRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    private String uploadDir = "./uploads";

    // Method to save the uploaded file
    private String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) return null;
        

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique filename
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), filePath);
        
        return filename;
    }

    // Method to delete a file
    private void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.out.println("Error" + e.getMessage());
        }
    }

    public Snack createSnack(Snack snack, MultipartFile file) throws IOException {
        String filename = saveFile(file);
        if (filename != null) {
            snack.setImage(filename);
            snack.setImage_URL("/api/snacks/images/" + filename);
        }
        snack.setId(sequenceGeneratorService.generateSequence(Snack.SEQUENCE_NAME));
        return snackRepository.save(snack);
    }

    public List<Snack> getAllSnacks() {
        return snackRepository.findAll();
    }

    public Optional<Snack> getSnackById(int id) {
        return snackRepository.findById(id);
    }

    public List<Snack> getSnacksByType(String type) {
        System.out.println("Searching for snack type: " + type);
        List<Snack> snack = snackRepository.findByType(type);
        return snack;
    }

    public List<Snack> getSnacksByUserId(int userId) {
        return snackRepository.findByUserId(userId);
    }

    public Snack updateSnack(int id, Snack snackDetails, MultipartFile file) throws IOException {
        return snackRepository.findById(id).map(snack-> {
            // Delete old file if a new file is uploaded
            if (file != null && !file.isEmpty()) {
                deleteFile(snack.getImage());
                try {
                    String filename = saveFile(file);
                    snack.setImage(filename);
                    snack.setImage_URL("/api/snacks/images/" + filename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            snack.setName(snackDetails.getName());
            snack.setPrice(snackDetails.getPrice());
            snack.setSeller(snackDetails.getSeller());
            snack.setContact(snackDetails.getContact());
            snack.setLocation(snackDetails.getLocation());
            snack.setRating(snackDetails.getRating());
            snack.setType(snackDetails.getType());
            snack.setUserId(snackDetails.getUserId());
            return snackRepository.save(snack);
        }).orElse(null);
    }

    public boolean deleteSnack(int id){
        if (snackRepository.existsById(id)) {
            snackRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

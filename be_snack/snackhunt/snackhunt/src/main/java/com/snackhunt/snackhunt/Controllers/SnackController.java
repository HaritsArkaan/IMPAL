package com.snackhunt.snackhunt.Controllers;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import com.snackhunt.snackhunt.Services.*;

import io.swagger.v3.oas.annotations.Operation;

import com.snackhunt.snackhunt.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/snacks")
public class SnackController {
    
    @Autowired
    private SnackService snackService;

    @Operation (summary = "Make a new Snack", description = "Make a new Snack")
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> createSnack(
        @RequestParam("name") String name,
        @RequestParam("price") int price,
        @RequestParam("seller") String seller,
        @RequestParam("contact") String contact,
        @RequestParam("location") String location,
        @RequestParam("rating") double rating,
        @RequestParam("type") String type,
        @RequestParam("userId") int userId,
        @RequestParam("file") MultipartFile file) throws IOException {
        
            try {
                name = URLDecoder.decode(name, StandardCharsets.UTF_8.toString());
                seller = URLDecoder.decode(seller, StandardCharsets.UTF_8.toString());
                contact = URLDecoder.decode(contact, StandardCharsets.UTF_8.toString());
                location = URLDecoder.decode(location, StandardCharsets.UTF_8.toString());
            } catch(Exception e) {
                return ResponseEntity.badRequest().body(new Message("Error : " + e.getMessage()));
            }

            // Validasi file: tipe MIME
            String contentType = file.getContentType();
            if (contentType == null || 
                !(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                return ResponseEntity.badRequest().body(new Message("Error : File harus berupa gambar JPEG atau PNG"));
            }

            // Validasi file: ukuran
            long fileSizeInBytes = file.getSize();
            long maxFileSizeInBytes = 10 * 1024 * 1024; // 10 MB
            if (fileSizeInBytes > maxFileSizeInBytes) {
                return ResponseEntity.badRequest().body(new Message("Error : Ukuran file terlalu besar, maksimal 10 MB"));
            }

            Snack snack = new Snack(name, price, null, null, seller, contact, location, rating, type, userId);
            Snack createdSnack = snackService.createSnack(snack, file);
            return ResponseEntity.ok(createdSnack);
    }
    @Operation(summary = "Get all snacks", description = "Get all snacks")
    @GetMapping("/get")
    public List<Snack> getAllSnacks() {
        return snackService.getAllSnacks();
    }

    @GetMapping("/user/{id}")
    public List<Snack> getSnacksByUserId(@PathVariable int id) {
        return snackService.getSnacksByUserId(id);
    }

    @Operation(summary = "Get snack by id", description = "Get Get snack by id")
    @GetMapping("/get/{id}")
    public ResponseEntity<Snack> getSnackById(@PathVariable int id) {
        return snackService.getSnackById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update a snack", description = "Update an already existing snack.")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateSnack(
        @PathVariable int id,
        @RequestParam("name") String name,
        @RequestParam("price") int price,
        @RequestParam("seller") String seller,
        @RequestParam("contact") String contact,
        @RequestParam("location") String location,
        @RequestParam("rating") double rating,
        @RequestParam("type") String type,
        @RequestParam("userId") int userId,
        @RequestPart(value = "file", required = false) MultipartFile file) {

            try {
                name = URLDecoder.decode(name, StandardCharsets.UTF_8.toString());
                seller = URLDecoder.decode(seller, StandardCharsets.UTF_8.toString());
                contact = URLDecoder.decode(contact, StandardCharsets.UTF_8.toString());
                location = URLDecoder.decode(location, StandardCharsets.UTF_8.toString());
            } catch(Exception e) {
                return ResponseEntity.badRequest().body(new Message("Error : " + e.getMessage()));
            }

            if (file != null) {
                // Validasi file: tipe MIME
                String contentType = file.getContentType();
                if (contentType == null || 
                    !(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                    return ResponseEntity.badRequest().body(new Message("Error : File harus berupa gambar JPEG atau PNG"));
                }
    
                // Validasi file: ukuran
                long fileSizeInBytes = file.getSize();
                long maxFileSizeInBytes = 10 * 1024 * 1024; // 5 MB
                if (fileSizeInBytes > maxFileSizeInBytes) {
                    return ResponseEntity.badRequest().body(new Message("Error : Ukuran file terlalu besar, maksimal 10 MB"));
                }
            }

            Snack snackDetails = new Snack(name, price, null, null, seller, contact, location, rating, type, userId);
            try {
                Snack updatedSnack = snackService.updateSnack(id, snackDetails, file);
                return updatedSnack != null ? ResponseEntity.ok(updatedSnack) : ResponseEntity.badRequest().body(new Message("Error : Something went wrong"));
            } catch(IOException e) {
                return ResponseEntity.badRequest().body(new Message("Error: "+ e.getMessage()));
            }
    }

    @Operation(summary = "Delete snack by id", description = "Delete a single snack by its id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnack(@PathVariable int id) {
        return snackService.deleteSnack(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get a snack's image", description = "Get a snack's image by its image name")
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get("./be_snack/uploads", filename);

        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        byte[] image = Files.readAllBytes(filePath);
        String contentType = Files.probeContentType(filePath); // Dapatkan tipe konten file secara otomatis

        return ResponseEntity.ok()
                .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                .body(image);
    }
    
}

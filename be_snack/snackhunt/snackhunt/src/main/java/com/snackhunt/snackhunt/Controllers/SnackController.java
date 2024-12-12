package com.snackhunt.snackhunt.Controllers;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.snackhunt.snackhunt.Services.*;
import com.snackhunt.snackhunt.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/snacks")
public class SnackController {
    
    @Autowired
    private SnackService snackService;

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
            long maxFileSizeInBytes = 10 * 1024 * 1024; // 5 MB
            if (fileSizeInBytes > maxFileSizeInBytes) {
                return ResponseEntity.badRequest().body(new Message("Error : Ukuran file terlalu besar, maksimal 10 MB"));
            }

            Snack snack = new Snack(name, price, null, null, seller, contact, location, rating, type, userId);
            Snack createdSnack = snackService.createSnack(snack, file);
            return ResponseEntity.ok(createdSnack);
    }

    @GetMapping
    public List<Snack> getAllSnacks() {
        return snackService.getAllSnacks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Snack> getSnackById(@PathVariable int id) {
        return snackService.getSnackById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
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

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get("./uploads", filename);

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

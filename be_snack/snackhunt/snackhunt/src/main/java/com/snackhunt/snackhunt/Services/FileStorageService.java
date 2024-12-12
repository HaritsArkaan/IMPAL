package com.snackhunt.snackhunt.Services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private String uploadDir = "./uploads";

    public Path storeFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path targetLocation = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);
        return targetLocation;
    }

    public void deleteFile(Path path) {
        File file = path.toFile();
        if (file.exists()) {
            file.delete();
        }
    }

    public String getImageURL(Path imagePath) {
        return imagePath.toString();
    }
}
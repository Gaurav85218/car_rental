package com.carrental.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");

        try {
            // This simplified call will now match the signature generated
            // by the secret you just provided.
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    com.cloudinary.utils.ObjectUtils.emptyMap()
            );

            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new IOException("Cloudinary upload failed: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) throws IOException {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to delete image from Cloudinary", e);
        }
    }
}

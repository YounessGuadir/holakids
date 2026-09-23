package ma.holakids.files;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import ma.holakids.common.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final Path uploadDirectory;

    public FileStorageService(@Value("${application.uploads.directory}") String directory) {
        this.uploadDirectory = Path.of(directory).toAbsolutePath().normalize();
    }

    @PostConstruct
    void initialize() throws IOException {
        Files.createDirectories(uploadDirectory);
    }

    public String store(MultipartFile file) {
        if (file.isEmpty() || !ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Utilisez une image JPG, PNG ou WEBP non vide.");
        }

        String extension = switch (file.getContentType()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            default -> ".webp";
        };
        String filename = UUID.randomUUID().toString().toLowerCase(Locale.ROOT) + extension;
        Path destination = uploadDirectory.resolve(filename).normalize();
        if (!destination.getParent().equals(uploadDirectory)) {
            throw new IllegalArgumentException("Nom de fichier invalide.");
        }

        try (var input = file.getInputStream()) {
            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new IllegalStateException("Impossible d'enregistrer l'image.", exception);
        }
        return "/api/v1/files/" + filename;
    }

    public Resource load(String filename) {
        if (!filename.matches("[a-f0-9-]+\\.(jpg|png|webp)")) {
            throw new ResourceNotFoundException("Image introuvable.");
        }
        try {
            Path path = uploadDirectory.resolve(filename).normalize();
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Image introuvable.");
            }
            return resource;
        } catch (java.net.MalformedURLException exception) {
            throw new ResourceNotFoundException("Image introuvable.");
        }
    }
}

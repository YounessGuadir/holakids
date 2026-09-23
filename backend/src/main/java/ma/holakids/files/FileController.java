package ma.holakids.files;

import java.io.IOException;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({"/api/v1", "/api"})
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/admin/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        return Map.of("url", fileStorageService.store(file));
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> get(@PathVariable String filename) throws IOException {
        Resource resource = fileStorageService.load(filename);
        String contentType = resource.getFile().toPath().toString().endsWith(".png")
                ? MediaType.IMAGE_PNG_VALUE
                : resource.getFile().toPath().toString().endsWith(".webp")
                        ? "image/webp"
                        : MediaType.IMAGE_JPEG_VALUE;
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
    }
}

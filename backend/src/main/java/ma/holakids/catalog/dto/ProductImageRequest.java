package ma.holakids.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProductImageRequest(
        @NotBlank @Size(max = 500) String url,
        @NotBlank @Size(max = 220) String altFr,
        @NotBlank @Size(max = 220) String altAr) {
}

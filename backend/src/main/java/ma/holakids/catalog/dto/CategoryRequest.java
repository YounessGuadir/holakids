package ma.holakids.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(max = 80) String slug,
        @NotBlank @Size(max = 120) String nameFr,
        @NotBlank @Size(max = 120) String nameAr,
        @NotBlank @Size(max = 240) String descriptionFr,
        @NotBlank @Size(max = 240) String descriptionAr,
        @NotBlank @Size(max = 500) String imageUrl,
        @NotBlank @Size(max = 20) String color,
        @Min(0) @Max(999) int displayOrder,
        boolean active) {
}

package ma.holakids.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LocalizedTextRequest(
        @NotBlank @Size(max = 500) String textFr,
        @NotBlank @Size(max = 500) String textAr) {
}

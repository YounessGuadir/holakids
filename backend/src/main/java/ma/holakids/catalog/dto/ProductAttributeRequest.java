package ma.holakids.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProductAttributeRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Size(max = 240) String valueFr,
        @NotBlank @Size(max = 240) String valueAr) {
}

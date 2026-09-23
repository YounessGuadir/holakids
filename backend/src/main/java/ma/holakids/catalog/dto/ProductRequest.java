package ma.holakids.catalog.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank @Size(max = 160) String slug,
        @NotBlank @Size(max = 60) String sku,
        @Size(max = 100) String externalId,
        @NotBlank @Size(max = 220) String nameFr,
        @NotBlank @Size(max = 220) String nameAr,
        @NotBlank @Size(max = 160) String shortNameFr,
        @NotBlank @Size(max = 160) String shortNameAr,
        @NotBlank @Size(max = 4000) String descriptionFr,
        @NotBlank @Size(max = 4000) String descriptionAr,
        @NotBlank @Size(max = 120) String brand,
        @Size(max = 160) String subCategoryFr,
        @Size(max = 160) String subCategoryAr,
        @NotBlank @Size(max = 30) String ageRange,
        @Min(0) Integer ageMin,
        @Min(0) Integer ageMax,
        @Size(max = 20) String genderTarget,
        @DecimalMin("0.00") BigDecimal rating,
        @Min(0) Integer reviewCount,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        @DecimalMin("0.00") BigDecimal oldPrice,
        @Min(0) int stock,
        boolean promotion,
        boolean newProduct,
        boolean featured,
        boolean active,
        @NotBlank @Size(max = 500) String primaryImageUrl,
        @NotNull Long categoryId,
        @Valid List<ProductImageRequest> images,
        @Valid List<LocalizedTextRequest> features,
        @Valid List<ProductAttributeRequest> attributes) {
}

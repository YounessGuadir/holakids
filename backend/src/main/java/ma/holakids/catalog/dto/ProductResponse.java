package ma.holakids.catalog.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import ma.holakids.catalog.Availability;

public record ProductResponse(
        Long id,
        String slug,
        String sku,
        String externalId,
        String nameFr,
        String nameAr,
        String shortNameFr,
        String shortNameAr,
        String descriptionFr,
        String descriptionAr,
        String brand,
        String subCategoryFr,
        String subCategoryAr,
        String ageRange,
        Integer ageMin,
        Integer ageMax,
        String genderTarget,
        BigDecimal rating,
        int reviewCount,
        BigDecimal price,
        BigDecimal oldPrice,
        int discountPercentage,
        int stock,
        Availability availability,
        boolean available,
        boolean promotion,
        boolean newProduct,
        boolean featured,
        boolean active,
        String primaryImageUrl,
        String mainImage,
        CategoryResponse category,
        List<ProductImageResponse> images,
        List<ProductFeatureResponse> features,
        List<ProductAttributeResponse> attributes,
        Instant createdAt,
        Instant updatedAt) {

    public record ProductImageResponse(Long id, String url, String altFr, String altAr, int position) {
    }

    public record ProductFeatureResponse(Long id, String textFr, String textAr, int position) {
    }

    public record ProductAttributeResponse(
            Long id, String name, String valueFr, String valueAr, int position) {
    }
}

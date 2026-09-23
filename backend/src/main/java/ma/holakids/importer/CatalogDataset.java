package ma.holakids.importer;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record CatalogDataset(
        Metadata metadata,
        List<CategoryItem> categories,
        List<ProductItem> products) {

    public record Metadata(
            String name,
            String version,
            String generatedAt,
            String taxonomySource,
            String taxonomyLicense,
            int expectedProductCount,
            Map<String, Integer> expectedCountsByCategory) {
    }

    public record CategoryItem(
            String slug,
            String nameFr,
            String nameAr,
            String descriptionFr,
            String descriptionAr,
            String imageUrl,
            String color,
            int displayOrder) {
    }

    public record ProductItem(
            String externalId,
            String sku,
            String slug,
            String nameFr,
            String nameAr,
            String shortNameFr,
            String shortNameAr,
            String descriptionFr,
            String descriptionAr,
            String brand,
            String categorySlug,
            String subCategoryFr,
            String subCategoryAr,
            String ageRange,
            Integer ageMin,
            Integer ageMax,
            String genderTarget,
            BigDecimal price,
            BigDecimal oldPrice,
            int stock,
            boolean promotion,
            boolean newProduct,
            boolean featured,
            boolean active,
            BigDecimal rating,
            int reviewCount,
            String mainImage,
            List<ImageItem> images,
            List<String> featuresFr,
            List<String> featuresAr,
            List<AttributeItem> attributes) {
    }

    public record ImageItem(String url, String altFr, String altAr) {
    }

    public record AttributeItem(String name, String valueFr, String valueAr) {
    }
}

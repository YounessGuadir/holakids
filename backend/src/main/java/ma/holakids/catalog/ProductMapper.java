package ma.holakids.catalog;

import java.util.List;

import ma.holakids.catalog.dto.ProductResponse;

public final class ProductMapper {

    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {
        List<ProductResponse.ProductImageResponse> images = product.getImages().stream()
                .map(image -> new ProductResponse.ProductImageResponse(
                        image.getId(), image.getUrl(), image.getAltFr(), image.getAltAr(), image.getPosition()))
                .toList();

        List<ProductResponse.ProductFeatureResponse> features = product.getFeatures().stream()
                .map(feature -> new ProductResponse.ProductFeatureResponse(
                        feature.getId(), feature.getTextFr(), feature.getTextAr(), feature.getPosition()))
                .toList();

        List<ProductResponse.ProductAttributeResponse> attributes = product.getAttributes().stream()
                .map(attribute -> new ProductResponse.ProductAttributeResponse(
                        attribute.getId(), attribute.getName(), attribute.getValueFr(),
                        attribute.getValueAr(), attribute.getPosition()))
                .toList();

        return new ProductResponse(
                product.getId(),
                product.getSlug(),
                product.getSku(),
                product.getExternalId(),
                product.getNameFr(),
                product.getNameAr(),
                product.getShortNameFr(),
                product.getShortNameAr(),
                product.getDescriptionFr(),
                product.getDescriptionAr(),
                product.getBrand(),
                product.getSubCategoryFr(),
                product.getSubCategoryAr(),
                product.getAgeRange(),
                product.getAgeMin(),
                product.getAgeMax(),
                product.getGenderTarget(),
                product.getRating(),
                product.getReviewCount(),
                product.getPrice(),
                product.getOldPrice(),
                product.getDiscountPercentage(),
                product.getStock(),
                product.getAvailability(),
                product.getAvailability() != Availability.OUT_OF_STOCK,
                product.isPromotion(),
                product.isNewProduct(),
                product.isFeatured(),
                product.isActive(),
                product.getPrimaryImageUrl(),
                product.getPrimaryImageUrl(),
                CategoryMapper.toResponse(product.getCategory()),
                images,
                features,
                attributes,
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}

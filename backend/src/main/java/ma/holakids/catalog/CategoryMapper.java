package ma.holakids.catalog;

import ma.holakids.catalog.dto.CategoryResponse;

public final class CategoryMapper {

    private CategoryMapper() {
    }

    public static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getSlug(),
                category.getNameFr(),
                category.getNameAr(),
                category.getDescriptionFr(),
                category.getDescriptionAr(),
                category.getImageUrl(),
                category.getColor(),
                category.getDisplayOrder(),
                category.isActive());
    }
}

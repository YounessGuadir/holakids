package ma.holakids.catalog.dto;

public record CategoryResponse(
        Long id,
        String slug,
        String nameFr,
        String nameAr,
        String descriptionFr,
        String descriptionAr,
        String imageUrl,
        String color,
        int displayOrder,
        boolean active) {
}

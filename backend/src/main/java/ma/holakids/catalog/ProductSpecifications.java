package ma.holakids.catalog;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> filtered(
            boolean activeOnly,
            String search,
            String category,
            String age,
            String brand,
            Boolean promotion,
            Boolean newProduct,
            Boolean featured,
            Boolean available,
            BigDecimal maxPrice) {

        return (root, query, cb) -> {
            var predicate = cb.conjunction();

            if (activeOnly) {
                predicate = cb.and(predicate, cb.isTrue(root.get("active")));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicate = cb.and(predicate, cb.or(
                        cb.like(cb.lower(root.get("nameFr")), pattern),
                        cb.like(cb.lower(root.get("nameAr")), pattern),
                        cb.like(cb.lower(root.get("brand")), pattern),
                        cb.like(cb.lower(root.get("sku")), pattern)));
            }
            if (category != null && !category.isBlank()) {
                predicate = cb.and(predicate,
                        cb.equal(cb.lower(root.get("category").get("slug")), category.toLowerCase()));
            }
            if (age != null && !age.isBlank()) {
                predicate = cb.and(predicate, cb.equal(root.get("ageRange"), age));
            }
            if (brand != null && !brand.isBlank()) {
                predicate = cb.and(predicate, cb.equal(cb.lower(root.get("brand")), brand.toLowerCase()));
            }
            if (promotion != null) {
                predicate = cb.and(predicate, cb.equal(root.get("promotion"), promotion));
            }
            if (newProduct != null) {
                predicate = cb.and(predicate, cb.equal(root.get("newProduct"), newProduct));
            }
            if (featured != null) {
                predicate = cb.and(predicate, cb.equal(root.get("featured"), featured));
            }
            if (Boolean.TRUE.equals(available)) {
                predicate = cb.and(predicate, cb.greaterThan(root.get("stock"), 0), cb.isTrue(root.get("active")));
            }
            if (maxPrice != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return predicate;
        };
    }
}

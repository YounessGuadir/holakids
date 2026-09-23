package ma.holakids.importer;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import ma.holakids.catalog.Category;
import ma.holakids.catalog.CategoryRepository;
import ma.holakids.catalog.Product;
import ma.holakids.catalog.ProductAttribute;
import ma.holakids.catalog.ProductFeature;
import ma.holakids.catalog.ProductImage;
import ma.holakids.catalog.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductImportService {

    private static final String FALLBACK_IMAGE = "/images/products/placeholder-toy.svg";

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public ProductImportService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public ImportResult importDataset(CatalogDataset dataset) {
        validate(dataset);
        Map<String, Category> categories = importMissingCategories(dataset.categories());

        Set<String> existingSkus = new HashSet<>();
        Set<String> existingSlugs = new HashSet<>();
        Set<String> existingExternalIds = new HashSet<>();
        productRepository.findAll().forEach(product -> {
            existingSkus.add(normalizeKey(product.getSku()));
            existingSlugs.add(normalizeKey(product.getSlug()));
            if (product.getExternalId() != null) {
                existingExternalIds.add(normalizeKey(product.getExternalId()));
            }
        });

        int imported = 0;
        int skipped = 0;
        List<Product> batch = new ArrayList<>();
        for (CatalogDataset.ProductItem item : dataset.products()) {
            String skuKey = normalizeKey(item.sku());
            String slugKey = normalizeKey(item.slug());
            String externalKey = normalizeKey(item.externalId());
            if (existingSkus.contains(skuKey) || existingSlugs.contains(slugKey)
                    || (!externalKey.isBlank() && existingExternalIds.contains(externalKey))) {
                skipped++;
                continue;
            }

            Category category = categories.get(normalizeKey(item.categorySlug()));
            if (category == null) {
                throw new IllegalStateException("Catégorie inconnue pour le SKU " + item.sku());
            }

            batch.add(toEntity(item, category));
            existingSkus.add(skuKey);
            existingSlugs.add(slugKey);
            if (!externalKey.isBlank()) {
                existingExternalIds.add(externalKey);
            }
            imported++;
        }
        productRepository.saveAll(batch);
        return new ImportResult(dataset.products().size(), imported, skipped, categories.size());
    }

    private Map<String, Category> importMissingCategories(List<CatalogDataset.CategoryItem> items) {
        Map<String, Category> categories = new HashMap<>();
        categoryRepository.findAll().forEach(category ->
                categories.put(normalizeKey(category.getSlug()), category));

        for (CatalogDataset.CategoryItem item : items) {
            String key = normalizeKey(item.slug());
            if (categories.containsKey(key)) {
                continue;
            }
            Category category = new Category();
            category.setSlug(item.slug().trim().toLowerCase(Locale.ROOT));
            category.setNameFr(clean(item.nameFr()));
            category.setNameAr(clean(item.nameAr()));
            category.setDescriptionFr(clean(item.descriptionFr()));
            category.setDescriptionAr(clean(item.descriptionAr()));
            category.setImageUrl(defaultIfBlank(item.imageUrl(), FALLBACK_IMAGE));
            category.setColor(defaultIfBlank(item.color(), "#eef5ff"));
            category.setDisplayOrder(item.displayOrder());
            category.setActive(true);
            categories.put(key, categoryRepository.save(category));
        }
        return categories;
    }

    private Product toEntity(CatalogDataset.ProductItem item, Category category) {
        Product product = new Product();
        product.setExternalId(blankToNull(item.externalId()));
        product.setSku(clean(item.sku()).toUpperCase(Locale.ROOT));
        product.setSlug(clean(item.slug()).toLowerCase(Locale.ROOT));
        product.setNameFr(clean(item.nameFr()));
        product.setNameAr(clean(item.nameAr()));
        product.setShortNameFr(defaultIfBlank(item.shortNameFr(), item.nameFr()));
        product.setShortNameAr(defaultIfBlank(item.shortNameAr(), item.nameAr()));
        product.setDescriptionFr(clean(item.descriptionFr()));
        product.setDescriptionAr(clean(item.descriptionAr()));
        product.setBrand(defaultIfBlank(item.brand(), "HOLAKIDS Selection"));
        product.setSubCategoryFr(blankToNull(item.subCategoryFr()));
        product.setSubCategoryAr(blankToNull(item.subCategoryAr()));
        product.setAgeRange(defaultIfBlank(item.ageRange(), "3-5"));
        product.setAgeMin(item.ageMin());
        product.setAgeMax(item.ageMax());
        product.setGenderTarget(defaultIfBlank(item.genderTarget(), "UNISEX").toUpperCase(Locale.ROOT));
        product.setPrice(item.price());
        product.setOldPrice(item.oldPrice());
        product.setStock(Math.max(item.stock(), 0));
        product.setPromotion(item.promotion() && item.oldPrice() != null);
        product.setNewProduct(item.newProduct());
        product.setFeatured(item.featured());
        product.setActive(item.active());
        product.setRating(item.rating() == null ? BigDecimal.ZERO : item.rating());
        product.setReviewCount(Math.max(item.reviewCount(), 0));
        product.setPrimaryImageUrl(defaultIfBlank(item.mainImage(), FALLBACK_IMAGE));
        product.setCategory(category);

        List<ProductImage> images = new ArrayList<>();
        if (item.images() != null) {
            for (int index = 0; index < item.images().size(); index++) {
                CatalogDataset.ImageItem image = item.images().get(index);
                images.add(new ProductImage(
                        defaultIfBlank(image.url(), FALLBACK_IMAGE),
                        defaultIfBlank(image.altFr(), item.shortNameFr()),
                        defaultIfBlank(image.altAr(), item.shortNameAr()),
                        index));
            }
        }
        if (images.isEmpty()) {
            images.add(new ProductImage(
                    product.getPrimaryImageUrl(), product.getShortNameFr(), product.getShortNameAr(), 0));
        }
        product.replaceImages(images);

        List<String> featuresFr = item.featuresFr() == null ? List.of() : item.featuresFr();
        List<String> featuresAr = item.featuresAr() == null ? List.of() : item.featuresAr();
        List<ProductFeature> features = new ArrayList<>();
        for (int index = 0; index < Math.max(featuresFr.size(), featuresAr.size()); index++) {
            String fr = index < featuresFr.size() ? featuresFr.get(index) : featuresAr.get(index);
            String ar = index < featuresAr.size() ? featuresAr.get(index) : fr;
            features.add(new ProductFeature(clean(fr), clean(ar), index));
        }
        product.replaceFeatures(features);

        List<ProductAttribute> attributes = new ArrayList<>();
        if (item.attributes() != null) {
            for (int index = 0; index < item.attributes().size(); index++) {
                CatalogDataset.AttributeItem attribute = item.attributes().get(index);
                attributes.add(new ProductAttribute(
                        clean(attribute.name()), clean(attribute.valueFr()),
                        clean(attribute.valueAr()), index));
            }
        }
        product.replaceAttributes(attributes);
        return product;
    }

    private void validate(CatalogDataset dataset) {
        if (dataset.metadata() != null && dataset.metadata().expectedProductCount() > 0
                && dataset.metadata().expectedProductCount() != dataset.products().size()) {
            throw new IllegalStateException("Nombre de produits différent de metadata.expectedProductCount.");
        }
        Set<String> skus = new HashSet<>();
        Set<String> slugs = new HashSet<>();
        for (CatalogDataset.ProductItem item : dataset.products()) {
            if (item.sku() == null || item.sku().isBlank() || item.slug() == null || item.slug().isBlank()
                    || item.nameFr() == null || item.nameAr() == null || item.price() == null) {
                throw new IllegalStateException("Produit dataset incomplet.");
            }
            if (!skus.add(normalizeKey(item.sku())) || !slugs.add(normalizeKey(item.slug()))) {
                throw new IllegalStateException("SKU ou slug dupliqué dans le dataset : " + item.sku());
            }
        }
    }

    private String clean(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : clean(value);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : clean(value);
    }

    private String normalizeKey(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    public record ImportResult(int datasetProducts, int imported, int skipped, int categories) {
    }
}

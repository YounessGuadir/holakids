package ma.holakids.catalog;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import ma.holakids.catalog.dto.ProductImageRequest;
import ma.holakids.catalog.dto.AvailabilityUpdateRequest;
import ma.holakids.catalog.dto.PriceUpdateRequest;
import ma.holakids.catalog.dto.ProductMetadataResponse;
import ma.holakids.catalog.dto.ProductRequest;
import ma.holakids.catalog.dto.ProductResponse;
import ma.holakids.catalog.dto.StockUpdateRequest;
import ma.holakids.common.ConflictException;
import ma.holakids.common.PageResponse;
import ma.holakids.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> listPublic(
            String search,
            String category,
            String age,
            String brand,
            Boolean promotion,
            Boolean newProduct,
            Boolean featured,
            Boolean available,
            BigDecimal maxPrice,
            int page,
            int size,
            String sort) {
        return list(true, search, category, age, brand, promotion, newProduct,
                featured, available, maxPrice, page, size, sort);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> listAdmin(int page, int size, String sort) {
        return list(false, null, null, null, null, null, null,
                null, null, null, page, size, sort);
    }

    private PageResponse<ProductResponse> list(
            boolean activeOnly,
            String search,
            String category,
            String age,
            String brand,
            Boolean promotion,
            Boolean newProduct,
            Boolean featured,
            Boolean available,
            BigDecimal maxPrice,
            int page,
            int size,
            String sort) {
        int safeSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(Math.max(page, 0), safeSize, resolveSort(sort));
        Page<ProductResponse> result = productRepository.findAll(
                        ProductSpecifications.filtered(activeOnly, search, category, age, brand,
                                promotion, newProduct, featured, available, maxPrice),
                        pageable)
                .map(ProductMapper::toResponse);
        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public ProductResponse getPublicBySlug(String slug) {
        return productRepository.findBySlugIgnoreCaseAndActiveTrue(slug)
                .map(ProductMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable."));
    }

    @Transactional(readOnly = true)
    public ProductResponse getPublicByIdentifier(String identifier) {
        try {
            Long id = Long.valueOf(identifier);
            return productRepository.findByIdAndActiveTrue(id)
                    .map(ProductMapper::toResponse)
                    .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable."));
        } catch (NumberFormatException ignored) {
            return getPublicBySlug(identifier);
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> byCategory(
            Long categoryId, int page, int size, String sort) {
        Category category = categoryService.getEntity(categoryId);
        return listPublic(null, category.getSlug(), null, null, null, null,
                null, null, null, page, size, sort);
    }

    @Transactional(readOnly = true)
    public ProductResponse getAdminById(Long id) {
        return ProductMapper.toResponse(getEntity(id));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> featured(int limit) {
        return productRepository.findTop8ByActiveTrueAndFeaturedTrueOrderByUpdatedAtDesc().stream()
                .limit(Math.min(Math.max(limit, 1), 8))
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> related(String slug, int limit) {
        Product product = productRepository.findBySlugIgnoreCaseAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable."));
        return productRepository
                .findTop4ByActiveTrueAndCategorySlugAndIdNotOrderByFeaturedDescUpdatedAtDesc(
                        product.getCategory().getSlug(), product.getId())
                .stream()
                .limit(Math.min(Math.max(limit, 1), 4))
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductMetadataResponse metadata() {
        return new ProductMetadataResponse(
                productRepository.findDistinctActiveBrands(),
                productRepository.findDistinctActiveAgeRanges());
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        ensureUnique(request.slug(), request.sku(), request.externalId(), null);
        Product product = new Product();
        apply(product, request);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getEntity(id);
        ensureUnique(request.slug(), request.sku(), request.externalId(), id);
        apply(product, request);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateStock(Long id, StockUpdateRequest request) {
        Product product = getEntity(id);
        product.setStock(request.stock());
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updatePrice(Long id, PriceUpdateRequest request) {
        Product product = getEntity(id);
        product.setPrice(request.price());
        product.setOldPrice(request.oldPrice());
        product.setPromotion(request.promotion());
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateAvailability(Long id, AvailabilityUpdateRequest request) {
        Product product = getEntity(id);
        product.setActive(request.active());
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(getEntity(id));
    }

    private Product getEntity(Long id) {
        return productRepository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable."));
    }

    private void ensureUnique(String slug, String sku, String externalId, Long currentId) {
        productRepository.findBySlugIgnoreCase(slug.trim())
                .filter(product -> !product.getId().equals(currentId))
                .ifPresent(product -> {
                    throw new ConflictException("Un produit utilise déjà ce slug.");
                });
        productRepository.findBySkuIgnoreCase(sku.trim())
                .filter(product -> !product.getId().equals(currentId))
                .ifPresent(product -> {
                    throw new ConflictException("Un produit utilise déjà cette référence SKU.");
                });
        if (externalId != null && !externalId.isBlank()) {
            productRepository.findByExternalIdIgnoreCase(externalId.trim())
                    .filter(product -> !product.getId().equals(currentId))
                    .ifPresent(product -> {
                        throw new ConflictException("Un produit utilise déjà cet identifiant externe.");
                    });
        }
    }

    private void apply(Product product, ProductRequest request) {
        product.setSlug(request.slug().trim().toLowerCase());
        product.setSku(request.sku().trim().toUpperCase());
        product.setExternalId(trimToNull(request.externalId()));
        product.setNameFr(request.nameFr().trim());
        product.setNameAr(request.nameAr().trim());
        product.setShortNameFr(request.shortNameFr().trim());
        product.setShortNameAr(request.shortNameAr().trim());
        product.setDescriptionFr(request.descriptionFr().trim());
        product.setDescriptionAr(request.descriptionAr().trim());
        product.setBrand(request.brand().trim());
        product.setSubCategoryFr(trimToNull(request.subCategoryFr()));
        product.setSubCategoryAr(trimToNull(request.subCategoryAr()));
        product.setAgeRange(request.ageRange().trim());
        product.setAgeMin(request.ageMin());
        product.setAgeMax(request.ageMax());
        product.setGenderTarget(request.genderTarget() == null || request.genderTarget().isBlank()
                ? "UNISEX" : request.genderTarget().trim().toUpperCase());
        product.setRating(request.rating() == null ? BigDecimal.ZERO : request.rating());
        product.setReviewCount(request.reviewCount() == null ? 0 : request.reviewCount());
        product.setPrice(request.price());
        product.setOldPrice(request.oldPrice());
        product.setStock(request.stock());
        product.setPromotion(request.promotion());
        product.setNewProduct(request.newProduct());
        product.setFeatured(request.featured());
        product.setActive(request.active());
        product.setPrimaryImageUrl(request.primaryImageUrl().trim());
        product.setCategory(categoryService.getEntity(request.categoryId()));

        List<ProductImage> images = new ArrayList<>();
        List<ProductImageRequest> imageRequests = request.images() == null ? List.of() : request.images();
        for (int index = 0; index < imageRequests.size(); index++) {
            ProductImageRequest image = imageRequests.get(index);
            images.add(new ProductImage(image.url().trim(), image.altFr().trim(), image.altAr().trim(), index));
        }
        if (images.isEmpty()) {
            images.add(new ProductImage(
                    request.primaryImageUrl().trim(),
                    request.shortNameFr().trim(),
                    request.shortNameAr().trim(),
                    0));
        }
        product.replaceImages(images);

        List<ProductFeature> features = new ArrayList<>();
        if (request.features() != null) {
            for (int index = 0; index < request.features().size(); index++) {
                var feature = request.features().get(index);
                features.add(new ProductFeature(feature.textFr().trim(), feature.textAr().trim(), index));
            }
        }
        product.replaceFeatures(features);

        List<ProductAttribute> attributes = new ArrayList<>();
        if (request.attributes() != null) {
            for (int index = 0; index < request.attributes().size(); index++) {
                var attribute = request.attributes().get(index);
                attributes.add(new ProductAttribute(
                        attribute.name().trim(), attribute.valueFr().trim(),
                        attribute.valueAr().trim(), index));
            }
        }
        product.replaceAttributes(attributes);
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private Sort resolveSort(String sort) {
        return switch (sort == null ? "featured" : sort) {
            case "price-asc" -> Sort.by(Sort.Order.asc("price"));
            case "price-desc" -> Sort.by(Sort.Order.desc("price"));
            case "new" -> Sort.by(Sort.Order.desc("newProduct"), Sort.Order.desc("createdAt"));
            case "promotion" -> Sort.by(Sort.Order.desc("promotion"), Sort.Order.asc("price"));
            case "popular" -> Sort.by(Sort.Order.desc("rating"), Sort.Order.desc("reviewCount"));
            case "name" -> Sort.by(Sort.Order.asc("nameFr"));
            default -> Sort.by(Sort.Order.desc("featured"), Sort.Order.desc("updatedAt"));
        };
    }
}

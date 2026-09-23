package ma.holakids.catalog;

import java.math.BigDecimal;
import java.util.List;

import ma.holakids.catalog.dto.ProductMetadataResponse;
import ma.holakids.catalog.dto.ProductResponse;
import ma.holakids.common.PageResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/products", "/api/products"})
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public PageResponse<ProductResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String age,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean promotion,
            @RequestParam(required = false) Boolean newProduct,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "featured") String sort) {
        return productService.listPublic(
                search, category, age, brand, promotion, newProduct,
                featured, available, maxPrice, page, size, sort);
    }

    @GetMapping("/featured")
    public List<ProductResponse> featured(@RequestParam(defaultValue = "8") int limit) {
        return productService.featured(limit);
    }

    @GetMapping("/popular")
    public PageResponse<ProductResponse> popular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return productService.listPublic(null, null, null, null, null, null,
                null, null, null, page, size, "popular");
    }

    @GetMapping("/promotions")
    public PageResponse<ProductResponse> promotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "promotion") String sort) {
        return productService.listPublic(null, null, null, null, true, null,
                null, null, null, page, size, sort);
    }

    @GetMapping("/search")
    public PageResponse<ProductResponse> search(
            @RequestParam(name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "featured") String sort) {
        return productService.listPublic(query, null, null, null, null, null,
                null, null, null, page, size, sort);
    }

    @GetMapping("/category/{categoryId}")
    public PageResponse<ProductResponse> byCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "featured") String sort) {
        return productService.byCategory(categoryId, page, size, sort);
    }

    @GetMapping("/meta")
    public ProductMetadataResponse metadata() {
        return productService.metadata();
    }

    @GetMapping("/{identifier}")
    public ProductResponse getByIdentifier(@PathVariable String identifier) {
        return productService.getPublicByIdentifier(identifier);
    }

    @GetMapping("/{slug}/related")
    public List<ProductResponse> related(
            @PathVariable String slug,
            @RequestParam(defaultValue = "4") int limit) {
        return productService.related(slug, limit);
    }
}

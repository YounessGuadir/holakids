package ma.holakids.catalog;

import ma.holakids.catalog.dto.ProductRequest;
import ma.holakids.catalog.dto.ProductResponse;
import ma.holakids.catalog.dto.StockUpdateRequest;
import ma.holakids.catalog.dto.PriceUpdateRequest;
import ma.holakids.catalog.dto.AvailabilityUpdateRequest;
import ma.holakids.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/admin/products", "/api/admin/products"})
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public PageResponse<ProductResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "featured") String sort) {
        return productService.listAdmin(page, size, sort);
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return productService.getAdminById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @PatchMapping("/{id}/stock")
    public ProductResponse updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request) {
        return productService.updateStock(id, request);
    }

    @PatchMapping("/{id}/price")
    public ProductResponse updatePrice(
            @PathVariable Long id,
            @Valid @RequestBody PriceUpdateRequest request) {
        return productService.updatePrice(id, request);
    }

    @PatchMapping("/{id}/availability")
    public ProductResponse updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityUpdateRequest request) {
        return productService.updateAvailability(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}

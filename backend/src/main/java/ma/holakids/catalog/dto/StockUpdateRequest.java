package ma.holakids.catalog.dto;

import jakarta.validation.constraints.Min;

public record StockUpdateRequest(@Min(0) int stock) {
}

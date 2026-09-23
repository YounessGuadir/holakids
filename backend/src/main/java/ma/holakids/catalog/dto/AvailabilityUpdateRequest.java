package ma.holakids.catalog.dto;

import jakarta.validation.constraints.NotNull;

public record AvailabilityUpdateRequest(@NotNull Boolean active) {
}

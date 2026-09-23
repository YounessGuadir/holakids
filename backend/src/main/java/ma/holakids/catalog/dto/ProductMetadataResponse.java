package ma.holakids.catalog.dto;

import java.util.List;

public record ProductMetadataResponse(List<String> brands, List<String> ageRanges) {
}

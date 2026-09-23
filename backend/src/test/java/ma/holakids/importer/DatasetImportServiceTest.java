package ma.holakids.importer;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class DatasetImportServiceTest {

    @Test
    void shouldLoadTheCompleteBilingualCatalog() {
        DatasetImportService service = new DatasetImportService(
                new ObjectMapper(), "datasets/products.json");

        CatalogDataset dataset = service.load();

        assertThat(dataset.products()).hasSize(460);
        assertThat(dataset.categories()).hasSize(22);
        assertThat(dataset.metadata().expectedProductCount()).isEqualTo(460);
        assertThat(dataset.metadata().expectedCountsByCategory().values())
                .allMatch(count -> count > 0);
        assertThat(dataset.products())
                .allMatch(product -> product.sku() != null && product.nameFr() != null
                        && product.nameAr() != null && product.price() != null);
    }
}

package ma.holakids.importer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.holakids.catalog.Category;
import ma.holakids.catalog.CategoryRepository;
import ma.holakids.catalog.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductImportServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Test
    void shouldImportAllProductsIntoAnEmptyDatabase() {
        CatalogDataset dataset = new DatasetImportService(
                new ObjectMapper(), "datasets/products.json").load();
        when(categoryRepository.findAll()).thenReturn(List.of());
        when(categoryRepository.save(any(Category.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(productRepository.findAll()).thenReturn(List.of());

        ProductImportService service = new ProductImportService(categoryRepository, productRepository);
        ProductImportService.ImportResult result = service.importDataset(dataset);

        assertThat(result.imported()).isEqualTo(460);
        assertThat(result.skipped()).isZero();
        assertThat(result.categories()).isEqualTo(22);
        verify(productRepository).saveAll(argThat(products ->
                java.util.stream.StreamSupport.stream(products.spliterator(), false).count() == 460));
    }
}

package ma.holakids.importer;

import java.io.IOException;
import java.io.InputStream;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class DatasetImportService {

    private final ObjectMapper objectMapper;
    private final String datasetPath;

    public DatasetImportService(
            ObjectMapper objectMapper,
            @Value("${application.seed.dataset:datasets/products.json}") String datasetPath) {
        this.objectMapper = objectMapper;
        this.datasetPath = datasetPath;
    }

    public CatalogDataset load() {
        ClassPathResource resource = new ClassPathResource(datasetPath);
        if (!resource.exists()) {
            throw new IllegalStateException("Dataset introuvable : " + datasetPath);
        }
        try (InputStream input = resource.getInputStream()) {
            CatalogDataset dataset = objectMapper.readValue(input, CatalogDataset.class);
            if (dataset.categories() == null || dataset.categories().isEmpty()
                    || dataset.products() == null || dataset.products().isEmpty()) {
                throw new IllegalStateException("Le dataset doit contenir des catégories et des produits.");
            }
            return dataset;
        } catch (IOException exception) {
            throw new IllegalStateException("Impossible de lire le dataset " + datasetPath, exception);
        }
    }
}

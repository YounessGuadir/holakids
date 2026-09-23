package ma.holakids.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlugIgnoreCaseAndActiveTrue(String slug);

    @Query("select p from Product p where p.id = :id")
    Optional<Product> findWithDetailsById(@Param("id") Long id);

    Optional<Product> findBySlugIgnoreCase(String slug);

    Optional<Product> findBySkuIgnoreCase(String sku);

    Optional<Product> findByExternalIdIgnoreCase(String externalId);

    Optional<Product> findByIdAndActiveTrue(Long id);

    List<Product> findTop8ByActiveTrueAndFeaturedTrueOrderByUpdatedAtDesc();

    List<Product> findTop4ByActiveTrueAndCategorySlugAndIdNotOrderByFeaturedDescUpdatedAtDesc(
            String categorySlug, Long productId);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsByExternalIdIgnoreCase(String externalId);

    @Query("select p.sku from Product p")
    List<String> findAllSkus();

    @Query("select distinct p.brand from Product p where p.active = true order by p.brand")
    List<String> findDistinctActiveBrands();

    @Query("select distinct p.ageRange from Product p where p.active = true order by p.ageRange")
    List<String> findDistinctActiveAgeRanges();
}

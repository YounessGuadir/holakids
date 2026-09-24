package ma.holakids.catalog;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import ma.holakids.common.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false, unique = true, length = 160)
    private String slug;

    @Column(nullable = false, unique = true, length = 60)
    private String sku;

    // Optional value: uniqueness is enforced for non-empty values by the service/importer.
    @Column(length = 100)
    private String externalId;

    @Column(nullable = false, length = 220)
    private String nameFr;

    @Column(nullable = false, length = 220)
    @Nationalized
    private String nameAr;

    @Column(nullable = false, length = 160)
    private String shortNameFr;

    @Column(nullable = false, length = 160)
    @Nationalized
    private String shortNameAr;

    @Column(nullable = false, length = 4000)
    private String descriptionFr;

    @Column(nullable = false, length = 4000)
    @Nationalized
    private String descriptionAr;

    @Column(nullable = false, length = 120)
    private String brand;

    @Column(length = 160)
    private String subCategoryFr;

    @Column(length = 160)
    @Nationalized
    private String subCategoryAr;

    @Column(nullable = false, length = 30)
    private String ageRange;

    private Integer ageMin;

    private Integer ageMax;

    @Column(length = 20)
    private String genderTarget = "UNISEX";

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    private Integer reviewCount = 0;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(precision = 12, scale = 2)
    private BigDecimal oldPrice;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private boolean promotion;

    @Column(nullable = false)
    private boolean newProduct;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, length = 500)
    private String primaryImageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC, id ASC")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC, id ASC")
    private List<ProductFeature> features = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC, id ASC")
    private List<ProductAttribute> attributes = new ArrayList<>();

    public Product() {
    }

    public Availability getAvailability() {
        if (!active || stock <= 0) {
            return Availability.OUT_OF_STOCK;
        }
        return stock <= 3 ? Availability.LOW_STOCK : Availability.AVAILABLE;
    }

    public void replaceImages(List<ProductImage> nextImages) {
        images.clear();
        nextImages.forEach(image -> {
            image.setProduct(this);
            images.add(image);
        });
    }

    public void replaceFeatures(List<ProductFeature> nextFeatures) {
        features.clear();
        nextFeatures.forEach(feature -> {
            feature.setProduct(this);
            features.add(feature);
        });
    }

    public void replaceAttributes(List<ProductAttribute> nextAttributes) {
        attributes.clear();
        nextAttributes.forEach(attribute -> {
            attribute.setProduct(this);
            attributes.add(attribute);
        });
    }

    public int getDiscountPercentage() {
        if (oldPrice == null || oldPrice.signum() <= 0 || price == null || price.compareTo(oldPrice) >= 0) {
            return 0;
        }
        return oldPrice.subtract(price)
                .multiply(BigDecimal.valueOf(100))
                .divide(oldPrice, 0, java.math.RoundingMode.HALF_UP)
                .intValue();
    }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    public String getNameFr() { return nameFr; }
    public void setNameFr(String nameFr) { this.nameFr = nameFr; }
    public String getNameAr() { return nameAr; }
    public void setNameAr(String nameAr) { this.nameAr = nameAr; }
    public String getShortNameFr() { return shortNameFr; }
    public void setShortNameFr(String shortNameFr) { this.shortNameFr = shortNameFr; }
    public String getShortNameAr() { return shortNameAr; }
    public void setShortNameAr(String shortNameAr) { this.shortNameAr = shortNameAr; }
    public String getDescriptionFr() { return descriptionFr; }
    public void setDescriptionFr(String descriptionFr) { this.descriptionFr = descriptionFr; }
    public String getDescriptionAr() { return descriptionAr; }
    public void setDescriptionAr(String descriptionAr) { this.descriptionAr = descriptionAr; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getSubCategoryFr() { return subCategoryFr; }
    public void setSubCategoryFr(String subCategoryFr) { this.subCategoryFr = subCategoryFr; }
    public String getSubCategoryAr() { return subCategoryAr; }
    public void setSubCategoryAr(String subCategoryAr) { this.subCategoryAr = subCategoryAr; }
    public String getAgeRange() { return ageRange; }
    public void setAgeRange(String ageRange) { this.ageRange = ageRange; }
    public Integer getAgeMin() { return ageMin; }
    public void setAgeMin(Integer ageMin) { this.ageMin = ageMin; }
    public Integer getAgeMax() { return ageMax; }
    public void setAgeMax(Integer ageMax) { this.ageMax = ageMax; }
    public String getGenderTarget() { return genderTarget == null ? "UNISEX" : genderTarget; }
    public void setGenderTarget(String genderTarget) { this.genderTarget = genderTarget; }
    public BigDecimal getRating() { return rating == null ? BigDecimal.ZERO : rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public int getReviewCount() { return reviewCount == null ? 0 : reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public boolean isPromotion() { return promotion; }
    public void setPromotion(boolean promotion) { this.promotion = promotion; }
    public boolean isNewProduct() { return newProduct; }
    public void setNewProduct(boolean newProduct) { this.newProduct = newProduct; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public List<ProductImage> getImages() { return images; }
    public List<ProductFeature> getFeatures() { return features; }
    public List<ProductAttribute> getAttributes() { return attributes; }
}

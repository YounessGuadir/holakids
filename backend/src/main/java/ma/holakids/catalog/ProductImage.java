package ma.holakids.catalog;

import ma.holakids.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "product_images")
public class ProductImage extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String url;

    @Column(nullable = false, length = 220)
    private String altFr;

    @Column(nullable = false, length = 220)
    @Nationalized
    private String altAr;

    @Column(nullable = false)
    private int position;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    protected ProductImage() {
    }

    public ProductImage(String url, String altFr, String altAr, int position) {
        this.url = url;
        this.altFr = altFr;
        this.altAr = altAr;
        this.position = position;
    }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getAltFr() { return altFr; }
    public void setAltFr(String altFr) { this.altFr = altFr; }
    public String getAltAr() { return altAr; }
    public void setAltAr(String altAr) { this.altAr = altAr; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}

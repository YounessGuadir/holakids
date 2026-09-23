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
@Table(name = "product_features")
public class ProductFeature extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String textFr;

    @Column(nullable = false, length = 500)
    @Nationalized
    private String textAr;

    @Column(nullable = false)
    private int position;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    protected ProductFeature() {
    }

    public ProductFeature(String textFr, String textAr, int position) {
        this.textFr = textFr;
        this.textAr = textAr;
        this.position = position;
    }

    public String getTextFr() { return textFr; }
    public void setTextFr(String textFr) { this.textFr = textFr; }
    public String getTextAr() { return textAr; }
    public void setTextAr(String textAr) { this.textAr = textAr; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}

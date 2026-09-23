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
@Table(name = "product_attributes")
public class ProductAttribute extends BaseEntity {

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 240)
    private String valueFr;

    @Column(nullable = false, length = 240)
    @Nationalized
    private String valueAr;

    @Column(nullable = false)
    private int position;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    protected ProductAttribute() {
    }

    public ProductAttribute(String name, String valueFr, String valueAr, int position) {
        this.name = name;
        this.valueFr = valueFr;
        this.valueAr = valueAr;
        this.position = position;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getValueFr() { return valueFr; }
    public void setValueFr(String valueFr) { this.valueFr = valueFr; }
    public String getValueAr() { return valueAr; }
    public void setValueAr(String valueAr) { this.valueAr = valueAr; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}

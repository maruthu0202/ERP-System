package com.erp.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name, sku, category;
    private BigDecimal unitPrice; 
    private Integer currentStock = 0, reorderLevel = 0;
    public Product() {}
    public Long getId() {return id;} public void setId(Long id) {this.id = id;}
    public String getName() {return name;} public void setName(String name) {this.name = name;}
    public String getSku() {return sku;} public void setSku(String sku) {this.sku = sku;}
    public String getCategory() {return category;} public void setCategory(String category) {this.category = category;}
    public BigDecimal getUnitPrice() {return unitPrice;} public void setUnitPrice(BigDecimal unitPrice) {this.unitPrice = unitPrice;}
    public Integer getCurrentStock() {return currentStock;} public void setCurrentStock(Integer currentStock) {this.currentStock = currentStock;}
    public Integer getReorderLevel() {return reorderLevel;} public void setReorderLevel(Integer reorderLevel) {this.reorderLevel = reorderLevel;}
}

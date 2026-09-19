package com.bajrix.marketplace.domain.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "products",
    indexes = {
        @Index(name = "idx_products_category", columnList = "category_id"),
        @Index(name = "idx_products_sku", columnList = "sku"),
        @Index(name = "idx_products_brand", columnList = "brand")
    }
)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "unit_of_measure", nullable = false, length = 50)
    private String unitOfMeasure;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public Product() {}

    public Product(UUID id, String name, String brand, String sku, String unitOfMeasure,
                   String description, String imageUrl, Category category, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.sku = sku;
        this.unitOfMeasure = unitOfMeasure;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String name;
        private String brand;
        private String sku;
        private String unitOfMeasure;
        private String description;
        private String imageUrl;
        private Category category;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder brand(String brand) { this.brand = brand; return this; }
        public Builder sku(String sku) { this.sku = sku; return this; }
        public Builder unitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Product build() {
            return new Product(id, name, brand, sku, unitOfMeasure, description, imageUrl, category, createdAt, updatedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

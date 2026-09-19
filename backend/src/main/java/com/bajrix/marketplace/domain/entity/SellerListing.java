package com.bajrix.marketplace.domain.entity;

import com.bajrix.marketplace.domain.enums.ListingStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "seller_listings",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_seller_product", columnNames = {"seller_id", "product_id"})
    },
    indexes = {
        @Index(name = "idx_listings_product_status", columnList = "product_id, status"),
        @Index(name = "idx_listings_seller", columnList = "seller_id"),
        @Index(name = "idx_listings_price", columnList = "price")
    }
)
public class SellerListing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "available_stock", nullable = false)
    private Integer availableStock;

    @Column(name = "min_order_quantity", nullable = false)
    private Integer minOrderQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ListingStatus status = ListingStatus.ACTIVE;

    @Version
    @Column(nullable = false)
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public SellerListing() {}

    public SellerListing(UUID id, Product product, Seller seller, BigDecimal price,
                         Integer availableStock, Integer minOrderQuantity, ListingStatus status,
                         Long version, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.product = product;
        this.seller = seller;
        this.price = price;
        this.availableStock = availableStock;
        this.minOrderQuantity = minOrderQuantity;
        this.status = status != null ? status : ListingStatus.ACTIVE;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Product product;
        private Seller seller;
        private BigDecimal price;
        private Integer availableStock;
        private Integer minOrderQuantity;
        private ListingStatus status = ListingStatus.ACTIVE;
        private Long version;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder seller(Seller seller) { this.seller = seller; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder availableStock(Integer availableStock) { this.availableStock = availableStock; return this; }
        public Builder minOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; return this; }
        public Builder status(ListingStatus status) { this.status = status; return this; }
        public Builder version(Long version) { this.version = version; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public SellerListing build() {
            return new SellerListing(id, product, seller, price, availableStock, minOrderQuantity, status, version, createdAt, updatedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Seller getSeller() { return seller; }
    public void setSeller(Seller seller) { this.seller = seller; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }

    public Integer getMinOrderQuantity() { return minOrderQuantity; }
    public void setMinOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; }

    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

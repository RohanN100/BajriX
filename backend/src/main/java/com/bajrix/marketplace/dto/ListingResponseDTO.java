package com.bajrix.marketplace.dto;

import com.bajrix.marketplace.domain.enums.ListingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ListingResponseDTO {
    private UUID id;
    private UUID productId;
    private String productName;
    private String productBrand;
    private String productSku;
    private String unitOfMeasure;
    private String categoryName;
    private String imageUrl;

    private UUID sellerId;
    private String sellerBusinessName;

    private BigDecimal price;
    private Integer availableStock;
    private Integer minOrderQuantity;
    private ListingStatus status;
    private Long version;

    private Instant createdAt;
    private Instant updatedAt;

    public ListingResponseDTO() {}

    public ListingResponseDTO(UUID id, UUID productId, String productName, String productBrand,
                              String productSku, String unitOfMeasure, String categoryName, String imageUrl,
                              UUID sellerId, String sellerBusinessName, BigDecimal price,
                              Integer availableStock, Integer minOrderQuantity, ListingStatus status,
                              Long version, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productBrand = productBrand;
        this.productSku = productSku;
        this.unitOfMeasure = unitOfMeasure;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.sellerId = sellerId;
        this.sellerBusinessName = sellerBusinessName;
        this.price = price;
        this.availableStock = availableStock;
        this.minOrderQuantity = minOrderQuantity;
        this.status = status;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private UUID productId;
        private String productName;
        private String productBrand;
        private String productSku;
        private String unitOfMeasure;
        private String categoryName;
        private String imageUrl;
        private UUID sellerId;
        private String sellerBusinessName;
        private BigDecimal price;
        private Integer availableStock;
        private Integer minOrderQuantity;
        private ListingStatus status;
        private Long version;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder productId(UUID productId) { this.productId = productId; return this; }
        public Builder productName(String productName) { this.productName = productName; return this; }
        public Builder productBrand(String productBrand) { this.productBrand = productBrand; return this; }
        public Builder productSku(String productSku) { this.productSku = productSku; return this; }
        public Builder unitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder sellerId(UUID sellerId) { this.sellerId = sellerId; return this; }
        public Builder sellerBusinessName(String sellerBusinessName) { this.sellerBusinessName = sellerBusinessName; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder availableStock(Integer availableStock) { this.availableStock = availableStock; return this; }
        public Builder minOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; return this; }
        public Builder status(ListingStatus status) { this.status = status; return this; }
        public Builder version(Long version) { this.version = version; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public ListingResponseDTO build() {
            return new ListingResponseDTO(id, productId, productName, productBrand, productSku,
                    unitOfMeasure, categoryName, imageUrl, sellerId, sellerBusinessName, price,
                    availableStock, minOrderQuantity, status, version, createdAt, updatedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductBrand() { return productBrand; }
    public void setProductBrand(String productBrand) { this.productBrand = productBrand; }
    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }
    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public UUID getSellerId() { return sellerId; }
    public void setSellerId(UUID sellerId) { this.sellerId = sellerId; }
    public String getSellerBusinessName() { return sellerBusinessName; }
    public void setSellerBusinessName(String sellerBusinessName) { this.sellerBusinessName = sellerBusinessName; }
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

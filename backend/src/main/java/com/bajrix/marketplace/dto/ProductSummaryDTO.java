package com.bajrix.marketplace.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class ProductSummaryDTO {
    private UUID id;
    private String name;
    private String brand;
    private String sku;
    private String unitOfMeasure;
    private String description;
    private String imageUrl;
    private CategoryDTO category;

    private int activeSellersCount;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private int totalAvailableStock;
    private boolean inStock;

    public ProductSummaryDTO() {}

    public ProductSummaryDTO(UUID id, String name, String brand, String sku, String unitOfMeasure,
                             String description, String imageUrl, CategoryDTO category,
                             int activeSellersCount, BigDecimal minPrice, BigDecimal maxPrice,
                             int totalAvailableStock, boolean inStock) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.sku = sku;
        this.unitOfMeasure = unitOfMeasure;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.activeSellersCount = activeSellersCount;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.totalAvailableStock = totalAvailableStock;
        this.inStock = inStock;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private String name;
        private String brand;
        private String sku;
        private String unitOfMeasure;
        private String description;
        private String imageUrl;
        private CategoryDTO category;
        private int activeSellersCount;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private int totalAvailableStock;
        private boolean inStock;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder brand(String brand) { this.brand = brand; return this; }
        public Builder sku(String sku) { this.sku = sku; return this; }
        public Builder unitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder category(CategoryDTO category) { this.category = category; return this; }
        public Builder activeSellersCount(int activeSellersCount) { this.activeSellersCount = activeSellersCount; return this; }
        public Builder minPrice(BigDecimal minPrice) { this.minPrice = minPrice; return this; }
        public Builder maxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; return this; }
        public Builder totalAvailableStock(int totalAvailableStock) { this.totalAvailableStock = totalAvailableStock; return this; }
        public Builder inStock(boolean inStock) { this.inStock = inStock; return this; }

        public ProductSummaryDTO build() {
            return new ProductSummaryDTO(id, name, brand, sku, unitOfMeasure, description, imageUrl,
                    category, activeSellersCount, minPrice, maxPrice, totalAvailableStock, inStock);
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
    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }
    public int getActiveSellersCount() { return activeSellersCount; }
    public void setActiveSellersCount(int activeSellersCount) { this.activeSellersCount = activeSellersCount; }
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    public int getTotalAvailableStock() { return totalAvailableStock; }
    public void setTotalAvailableStock(int totalAvailableStock) { this.totalAvailableStock = totalAvailableStock; }
    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
}

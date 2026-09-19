package com.bajrix.marketplace.dto;

import com.bajrix.marketplace.domain.enums.ListingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateListingRequest {

    @NotNull(message = "Product ID is required")
    private UUID productId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Available stock is required")
    @Min(value = 0, message = "Available stock cannot be negative")
    private Integer availableStock;

    @NotNull(message = "Minimum order quantity is required")
    @Min(value = 1, message = "Minimum order quantity must be at least 1")
    private Integer minOrderQuantity;

    private ListingStatus status;

    public CreateListingRequest() {}

    public CreateListingRequest(UUID productId, BigDecimal price, Integer availableStock,
                                Integer minOrderQuantity, ListingStatus status) {
        this.productId = productId;
        this.price = price;
        this.availableStock = availableStock;
        this.minOrderQuantity = minOrderQuantity;
        this.status = status;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID productId;
        private BigDecimal price;
        private Integer availableStock;
        private Integer minOrderQuantity;
        private ListingStatus status;

        public Builder productId(UUID productId) { this.productId = productId; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder availableStock(Integer availableStock) { this.availableStock = availableStock; return this; }
        public Builder minOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; return this; }
        public Builder status(ListingStatus status) { this.status = status; return this; }

        public CreateListingRequest build() {
            return new CreateListingRequest(productId, price, availableStock, minOrderQuantity, status);
        }
    }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
    public Integer getMinOrderQuantity() { return minOrderQuantity; }
    public void setMinOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; }
    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }
}

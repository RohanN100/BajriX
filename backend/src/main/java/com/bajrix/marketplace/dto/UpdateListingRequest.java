package com.bajrix.marketplace.dto;

import com.bajrix.marketplace.domain.enums.ListingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UpdateListingRequest {

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Available stock is required")
    @Min(value = 0, message = "Available stock cannot be negative")
    private Integer availableStock;

    @NotNull(message = "Minimum order quantity is required")
    @Min(value = 1, message = "Minimum order quantity must be at least 1")
    private Integer minOrderQuantity;

    @NotNull(message = "Status is required")
    private ListingStatus status;

    @NotNull(message = "Listing version is required for concurrency control")
    private Long version;

    public UpdateListingRequest() {}

    public UpdateListingRequest(BigDecimal price, Integer availableStock, Integer minOrderQuantity,
                                ListingStatus status, Long version) {
        this.price = price;
        this.availableStock = availableStock;
        this.minOrderQuantity = minOrderQuantity;
        this.status = status;
        this.version = version;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private BigDecimal price;
        private Integer availableStock;
        private Integer minOrderQuantity;
        private ListingStatus status;
        private Long version;

        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder availableStock(Integer availableStock) { this.availableStock = availableStock; return this; }
        public Builder minOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; return this; }
        public Builder status(ListingStatus status) { this.status = status; return this; }
        public Builder version(Long version) { this.version = version; return this; }

        public UpdateListingRequest build() {
            return new UpdateListingRequest(price, availableStock, minOrderQuantity, status, version);
        }
    }

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
}

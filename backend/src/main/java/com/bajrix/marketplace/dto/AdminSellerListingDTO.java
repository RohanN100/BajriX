package com.bajrix.marketplace.dto;

import com.bajrix.marketplace.domain.enums.ListingStatus;

import java.math.BigDecimal;
import java.util.UUID;

public class AdminSellerListingDTO {

    private UUID id;
    private UUID productId;
    private String productName;
    private String productBrand;
    private BigDecimal price;
    private int availableStock;
    private int minOrderQuantity;
    private ListingStatus status;
    private Long version;

    public AdminSellerListingDTO() {
    }

    public AdminSellerListingDTO(
            UUID id,
            UUID productId,
            String productName,
            String productBrand,
            BigDecimal price,
            int availableStock,
            int minOrderQuantity,
            ListingStatus status,
            Long version
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productBrand = productBrand;
        this.price = price;
        this.availableStock = availableStock;
        this.minOrderQuantity = minOrderQuantity;
        this.status = status;
        this.version = version;
    }

    public UUID getId() {
        return id;
    }

    public UUID getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getAvailableStock() {
        return availableStock;
    }

    public int getMinOrderQuantity() {
        return minOrderQuantity;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public Long getVersion() {
        return version;
    }
}
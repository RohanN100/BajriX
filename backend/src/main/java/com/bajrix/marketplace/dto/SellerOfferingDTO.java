package com.bajrix.marketplace.dto;

import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;

import java.math.BigDecimal;
import java.util.UUID;

public class SellerOfferingDTO {
    private UUID listingId;
    private UUID sellerId;
    private String sellerName;
    private BigDecimal sellerRating;
    private String sellerCity;
    private String sellerState;
    private SellerStatus sellerStatus;
    private BigDecimal price;
    private Integer availableStock;
    private Integer minOrderQuantity;
    private ListingStatus listingStatus;
    private Long version;
    private boolean lowestPrice;

    public SellerOfferingDTO() {}

    public SellerOfferingDTO(UUID listingId, UUID sellerId, String sellerName, BigDecimal sellerRating,
                             String sellerCity, String sellerState, SellerStatus sellerStatus,
                             BigDecimal price, Integer availableStock, Integer minOrderQuantity,
                             ListingStatus listingStatus, Long version, boolean lowestPrice) {
        this.listingId = listingId;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.sellerRating = sellerRating;
        this.sellerCity = sellerCity;
        this.sellerState = sellerState;
        this.sellerStatus = sellerStatus;
        this.price = price;
        this.availableStock = availableStock;
        this.minOrderQuantity = minOrderQuantity;
        this.listingStatus = listingStatus;
        this.version = version;
        this.lowestPrice = lowestPrice;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID listingId;
        private UUID sellerId;
        private String sellerName;
        private BigDecimal sellerRating;
        private String sellerCity;
        private String sellerState;
        private SellerStatus sellerStatus;
        private BigDecimal price;
        private Integer availableStock;
        private Integer minOrderQuantity;
        private ListingStatus listingStatus;
        private Long version;
        private boolean lowestPrice;

        public Builder listingId(UUID listingId) { this.listingId = listingId; return this; }
        public Builder sellerId(UUID sellerId) { this.sellerId = sellerId; return this; }
        public Builder sellerName(String sellerName) { this.sellerName = sellerName; return this; }
        public Builder sellerRating(BigDecimal sellerRating) { this.sellerRating = sellerRating; return this; }
        public Builder sellerCity(String sellerCity) { this.sellerCity = sellerCity; return this; }
        public Builder sellerState(String sellerState) { this.sellerState = sellerState; return this; }
        public Builder sellerStatus(SellerStatus sellerStatus) { this.sellerStatus = sellerStatus; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder availableStock(Integer availableStock) { this.availableStock = availableStock; return this; }
        public Builder minOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; return this; }
        public Builder listingStatus(ListingStatus listingStatus) { this.listingStatus = listingStatus; return this; }
        public Builder version(Long version) { this.version = version; return this; }
        public Builder lowestPrice(boolean lowestPrice) { this.lowestPrice = lowestPrice; return this; }

        public SellerOfferingDTO build() {
            return new SellerOfferingDTO(listingId, sellerId, sellerName, sellerRating, sellerCity, sellerState,
                    sellerStatus, price, availableStock, minOrderQuantity, listingStatus, version, lowestPrice);
        }
    }

    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
    public UUID getSellerId() { return sellerId; }
    public void setSellerId(UUID sellerId) { this.sellerId = sellerId; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public BigDecimal getSellerRating() { return sellerRating; }
    public void setSellerRating(BigDecimal sellerRating) { this.sellerRating = sellerRating; }
    public String getSellerCity() { return sellerCity; }
    public void setSellerCity(String sellerCity) { this.sellerCity = sellerCity; }
    public String getSellerState() { return sellerState; }
    public void setSellerState(String sellerState) { this.sellerState = sellerState; }
    public SellerStatus getSellerStatus() { return sellerStatus; }
    public void setSellerStatus(SellerStatus sellerStatus) { this.sellerStatus = sellerStatus; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
    public Integer getMinOrderQuantity() { return minOrderQuantity; }
    public void setMinOrderQuantity(Integer minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; }
    public ListingStatus getListingStatus() { return listingStatus; }
    public void setListingStatus(ListingStatus listingStatus) { this.listingStatus = listingStatus; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public boolean isLowestPrice() { return lowestPrice; }
    public void setLowestPrice(boolean lowestPrice) { this.lowestPrice = lowestPrice; }
}

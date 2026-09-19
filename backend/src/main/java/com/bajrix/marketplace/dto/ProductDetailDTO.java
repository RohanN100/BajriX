package com.bajrix.marketplace.dto;

import java.util.List;

public class ProductDetailDTO {
    private ProductSummaryDTO product;
    private List<SellerOfferingDTO> offerings;

    public ProductDetailDTO() {}

    public ProductDetailDTO(ProductSummaryDTO product, List<SellerOfferingDTO> offerings) {
        this.product = product;
        this.offerings = offerings;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private ProductSummaryDTO product;
        private List<SellerOfferingDTO> offerings;

        public Builder product(ProductSummaryDTO product) { this.product = product; return this; }
        public Builder offerings(List<SellerOfferingDTO> offerings) { this.offerings = offerings; return this; }

        public ProductDetailDTO build() {
            return new ProductDetailDTO(product, offerings);
        }
    }

    public ProductSummaryDTO getProduct() { return product; }
    public void setProduct(ProductSummaryDTO product) { this.product = product; }
    public List<SellerOfferingDTO> getOfferings() { return offerings; }
    public void setOfferings(List<SellerOfferingDTO> offerings) { this.offerings = offerings; }
}

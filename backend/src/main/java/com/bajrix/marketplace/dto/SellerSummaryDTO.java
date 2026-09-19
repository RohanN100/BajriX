package com.bajrix.marketplace.dto;

import com.bajrix.marketplace.domain.enums.SellerStatus;

import java.math.BigDecimal;
import java.util.UUID;

public class SellerSummaryDTO {
    private UUID id;
    private String businessName;
    private String contactPerson;
    private String email;
    private String phone;
    private String city;
    private String state;
    private String gstNumber;
    private SellerStatus status;
    private BigDecimal rating;

    public SellerSummaryDTO() {}

    public SellerSummaryDTO(UUID id, String businessName, String contactPerson, String email,
                            String phone, String city, String state, String gstNumber,
                            SellerStatus status, BigDecimal rating) {
        this.id = id;
        this.businessName = businessName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.state = state;
        this.gstNumber = gstNumber;
        this.status = status;
        this.rating = rating;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private String businessName;
        private String contactPerson;
        private String email;
        private String phone;
        private String city;
        private String state;
        private String gstNumber;
        private SellerStatus status;
        private BigDecimal rating;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder businessName(String businessName) { this.businessName = businessName; return this; }
        public Builder contactPerson(String contactPerson) { this.contactPerson = contactPerson; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder gstNumber(String gstNumber) { this.gstNumber = gstNumber; return this; }
        public Builder status(SellerStatus status) { this.status = status; return this; }
        public Builder rating(BigDecimal rating) { this.rating = rating; return this; }

        public SellerSummaryDTO build() {
            return new SellerSummaryDTO(id, businessName, contactPerson, email, phone, city, state, gstNumber, status, rating);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }
    public SellerStatus getStatus() { return status; }
    public void setStatus(SellerStatus status) { this.status = status; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
}

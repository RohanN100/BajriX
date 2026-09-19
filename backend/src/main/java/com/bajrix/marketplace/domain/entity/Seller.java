package com.bajrix.marketplace.domain.entity;

import com.bajrix.marketplace.domain.enums.SellerStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "sellers",
    indexes = {
        @Index(name = "idx_sellers_status", columnList = "status"),
        @Index(name = "idx_sellers_city", columnList = "city")
    }
)
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "business_name", nullable = false, length = 150)
    private String businessName;

    @Column(name = "contact_person", nullable = false, length = 100)
    private String contactPerson;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "gst_number", length = 30)
    private String gstNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SellerStatus status = SellerStatus.PENDING;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Seller() {}

    public Seller(UUID id, String businessName, String contactPerson, String email, String phone,
                  String city, String state, String gstNumber, SellerStatus status, BigDecimal rating, Instant createdAt) {
        this.id = id;
        this.businessName = businessName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.state = state;
        this.gstNumber = gstNumber;
        this.status = status != null ? status : SellerStatus.PENDING;
        this.rating = rating != null ? rating : BigDecimal.valueOf(4.5);
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String businessName;
        private String contactPerson;
        private String email;
        private String phone;
        private String city;
        private String state;
        private String gstNumber;
        private SellerStatus status = SellerStatus.PENDING;
        private BigDecimal rating = BigDecimal.valueOf(4.5);
        private Instant createdAt;

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
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Seller build() {
            return new Seller(id, businessName, contactPerson, email, phone, city, state, gstNumber, status, rating, createdAt);
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

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

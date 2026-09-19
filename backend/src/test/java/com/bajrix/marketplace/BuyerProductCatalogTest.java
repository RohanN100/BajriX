package com.bajrix.marketplace;

import com.bajrix.marketplace.domain.entity.Category;
import com.bajrix.marketplace.domain.entity.Product;
import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.ProductDetailDTO;
import com.bajrix.marketplace.dto.ProductSummaryDTO;
import com.bajrix.marketplace.repository.CategoryRepository;
import com.bajrix.marketplace.repository.ProductRepository;
import com.bajrix.marketplace.repository.SellerListingRepository;
import com.bajrix.marketplace.repository.SellerRepository;
import com.bajrix.marketplace.service.ProductCatalogService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class BuyerProductCatalogTest {

    @Autowired
    private ProductCatalogService productCatalogService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Test
    @DisplayName("Buyer Discovery: Only listings from APPROVED sellers with ACTIVE status must be visible to buyers")
    void testBuyerVisibility_OnlyApprovedSellersVisible() {
        Category category = categoryRepository.save(Category.builder()
                .name("Cement " + UUID.randomUUID())
                .slug("cement-" + UUID.randomUUID())
                .build());

        Product product = productRepository.save(Product.builder()
                .name("UltraTech Special " + UUID.randomUUID())
                .brand("UltraTech")
                .sku("SKU-" + UUID.randomUUID())
                .unitOfMeasure("bag")
                .category(category)
                .build());

        Seller approvedSeller1 = sellerRepository.save(Seller.builder()
                .businessName("Approved Seller One")
                .contactPerson("Person 1")
                .email("app1-" + UUID.randomUUID() + "@test.com")
                .phone("+91-1111111111")
                .city("Pune")
                .state("MH")
                .status(SellerStatus.APPROVED)
                .build());

        Seller approvedSeller2 = sellerRepository.save(Seller.builder()
                .businessName("Approved Seller Two")
                .contactPerson("Person 2")
                .email("app2-" + UUID.randomUUID() + "@test.com")
                .phone("+91-2222222222")
                .city("Mumbai")
                .state("MH")
                .status(SellerStatus.APPROVED)
                .build());

        Seller pendingSeller = sellerRepository.save(Seller.builder()
                .businessName("Pending Seller")
                .contactPerson("Person 3")
                .email("pen3-" + UUID.randomUUID() + "@test.com")
                .phone("+91-3333333333")
                .city("Delhi")
                .state("DL")
                .status(SellerStatus.PENDING)
                .build());

        Seller rejectedSeller = sellerRepository.save(Seller.builder()
                .businessName("Rejected Seller")
                .contactPerson("Person 4")
                .email("rej4-" + UUID.randomUUID() + "@test.com")
                .phone("+91-4444444444")
                .city("Ahmedabad")
                .state("GJ")
                .status(SellerStatus.REJECTED)
                .build());

        // Approved Seller 1 listing: ₹390
        sellerListingRepository.save(SellerListing.builder()
                .product(product)
                .seller(approvedSeller1)
                .price(BigDecimal.valueOf(390.00))
                .availableStock(50)
                .minOrderQuantity(5)
                .status(ListingStatus.ACTIVE)
                .build());

        // Approved Seller 2 listing: ₹380 (Best price)
        sellerListingRepository.save(SellerListing.builder()
                .product(product)
                .seller(approvedSeller2)
                .price(BigDecimal.valueOf(380.00))
                .availableStock(100)
                .minOrderQuantity(10)
                .status(ListingStatus.ACTIVE)
                .build());

        // Pending Seller listing: ₹350 (Even cheaper, but seller is PENDING - MUST NOT SHOW)
        sellerListingRepository.save(SellerListing.builder()
                .product(product)
                .seller(pendingSeller)
                .price(BigDecimal.valueOf(350.00))
                .availableStock(200)
                .minOrderQuantity(1)
                .status(ListingStatus.ACTIVE)
                .build());

        // Rejected Seller listing: ₹360 (Seller is REJECTED - MUST NOT SHOW)
        sellerListingRepository.save(SellerListing.builder()
                .product(product)
                .seller(rejectedSeller)
                .price(BigDecimal.valueOf(360.00))
                .availableStock(200)
                .minOrderQuantity(1)
                .status(ListingStatus.ACTIVE)
                .build());

        // Test Product Details API
        ProductDetailDTO details = productCatalogService.getProductDetails(product.getId());

        // Must only show exactly 2 offerings (from approved sellers)
        assertEquals(2, details.getOfferings().size(), "Only offerings from APPROVED sellers should appear");

        // Verify ordering: cheapest first (₹380 before ₹390)
        assertEquals(BigDecimal.valueOf(380.00), details.getOfferings().get(0).getPrice());
        assertTrue(details.getOfferings().get(0).isLowestPrice(), "Cheapest offering should be marked as lowest price");

        assertEquals(BigDecimal.valueOf(390.00), details.getOfferings().get(1).getPrice());
        assertFalse(details.getOfferings().get(1).isLowestPrice());

        // Test Product Summary aggregations
        ProductSummaryDTO summary = details.getProduct();
        assertEquals(2, summary.getActiveSellersCount());
        assertEquals(BigDecimal.valueOf(380.00), summary.getMinPrice());
        assertEquals(BigDecimal.valueOf(390.00), summary.getMaxPrice());
        assertEquals(150, summary.getTotalAvailableStock()); // 50 + 100
        assertTrue(summary.isInStock());
    }
}

package com.bajrix.marketplace;

import com.bajrix.marketplace.domain.entity.Category;
import com.bajrix.marketplace.domain.entity.Product;
import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.CreateListingRequest;
import com.bajrix.marketplace.dto.ListingResponseDTO;
import com.bajrix.marketplace.dto.UpdateListingRequest;
import com.bajrix.marketplace.exception.DuplicateListingException;
import com.bajrix.marketplace.exception.OptimisticLockConflictException;
import com.bajrix.marketplace.exception.SellerNotApprovedException;
import com.bajrix.marketplace.exception.UnauthorizedSellerAccessException;
import com.bajrix.marketplace.repository.CategoryRepository;
import com.bajrix.marketplace.repository.ProductRepository;
import com.bajrix.marketplace.repository.SellerListingRepository;
import com.bajrix.marketplace.repository.SellerRepository;
import com.bajrix.marketplace.service.SellerListingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SellerListingServiceTest {

    @Autowired
    private SellerListingService sellerListingService;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    private Seller sellerA;
    private Seller sellerB;
    private Seller rejectedSeller;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        Category category = categoryRepository.save(Category.builder()
                .name("Test Category " + UUID.randomUUID())
                .slug("test-cat-" + UUID.randomUUID())
                .build());

        testProduct = productRepository.save(Product.builder()
                .name("Test Product " + UUID.randomUUID())
                .brand("Brand X")
                .sku("SKU-" + UUID.randomUUID())
                .unitOfMeasure("bag")
                .category(category)
                .build());

        sellerA = sellerRepository.save(Seller.builder()
                .businessName("Seller Alpha")
                .contactPerson("Alpha Person")
                .email("alpha-" + UUID.randomUUID() + "@test.com")
                .phone("+91-1111111111")
                .city("Pune")
                .state("Maharashtra")
                .status(SellerStatus.APPROVED)
                .build());

        sellerB = sellerRepository.save(Seller.builder()
                .businessName("Seller Beta")
                .contactPerson("Beta Person")
                .email("beta-" + UUID.randomUUID() + "@test.com")
                .phone("+91-2222222222")
                .city("Mumbai")
                .state("Maharashtra")
                .status(SellerStatus.APPROVED)
                .build());

        rejectedSeller = sellerRepository.save(Seller.builder()
                .businessName("Seller Gamma (Rejected)")
                .contactPerson("Gamma Person")
                .email("gamma-" + UUID.randomUUID() + "@test.com")
                .phone("+91-3333333333")
                .city("Delhi")
                .state("Delhi")
                .status(SellerStatus.REJECTED)
                .build());
    }

    @Test
    @DisplayName("Should successfully create a valid listing for an approved seller")
    void testCreateListing_Success() {
        CreateListingRequest request = CreateListingRequest.builder()
                .productId(testProduct.getId())
                .price(BigDecimal.valueOf(350.00))
                .availableStock(100)
                .minOrderQuantity(5)
                .status(ListingStatus.ACTIVE)
                .build();

        ListingResponseDTO response = sellerListingService.createListing(sellerA.getId(), request);

        assertNotNull(response.getId());
        assertEquals(testProduct.getId(), response.getProductId());
        assertEquals(sellerA.getId(), response.getSellerId());
        assertEquals(BigDecimal.valueOf(350.00), response.getPrice());
        assertEquals(100, response.getAvailableStock());
        assertEquals(5, response.getMinOrderQuantity());
        assertEquals(ListingStatus.ACTIVE, response.getStatus());
        assertNotNull(response.getVersion());
    }

    @Test
    @DisplayName("Should reject duplicate listing creation for same seller and product")
    void testCreateListing_DuplicateRejected() {
        CreateListingRequest request = CreateListingRequest.builder()
                .productId(testProduct.getId())
                .price(BigDecimal.valueOf(350.00))
                .availableStock(100)
                .minOrderQuantity(5)
                .build();

        sellerListingService.createListing(sellerA.getId(), request);

        assertThrows(DuplicateListingException.class, () ->
                sellerListingService.createListing(sellerA.getId(), request));
    }

    @Test
    @DisplayName("Should reject listing creation for REJECTED seller")
    void testCreateListing_RejectedSellerDenied() {
        CreateListingRequest request = CreateListingRequest.builder()
                .productId(testProduct.getId())
                .price(BigDecimal.valueOf(350.00))
                .availableStock(100)
                .minOrderQuantity(5)
                .build();

        assertThrows(SellerNotApprovedException.class, () ->
                sellerListingService.createListing(rejectedSeller.getId(), request));
    }

    @Test
    @DisplayName("Seller Isolation: Seller A cannot update Seller B's listing")
    void testSellerIsolation_CannotModifyAnotherSellersListing() {
        CreateListingRequest createRequest = CreateListingRequest.builder()
                .productId(testProduct.getId())
                .price(BigDecimal.valueOf(400.00))
                .availableStock(50)
                .minOrderQuantity(1)
                .build();

        ListingResponseDTO listingB = sellerListingService.createListing(sellerB.getId(), createRequest);

        UpdateListingRequest updateRequest = UpdateListingRequest.builder()
                .price(BigDecimal.valueOf(300.00))
                .availableStock(20)
                .minOrderQuantity(2)
                .status(ListingStatus.ACTIVE)
                .version(listingB.getVersion())
                .build();

        // Seller A tries to modify Seller B's listing
        assertThrows(UnauthorizedSellerAccessException.class, () ->
                sellerListingService.updateListing(sellerA.getId(), listingB.getId(), updateRequest));
    }

    @Test
    @DisplayName("Seller Isolation: Seller A cannot delete Seller B's listing")
    void testSellerIsolation_CannotDeleteAnotherSellersListing() {
        CreateListingRequest createRequest = CreateListingRequest.builder()
                .productId(testProduct.getId())
                .price(BigDecimal.valueOf(400.00))
                .availableStock(50)
                .minOrderQuantity(1)
                .build();

        ListingResponseDTO listingB = sellerListingService.createListing(sellerB.getId(), createRequest);

        assertThrows(UnauthorizedSellerAccessException.class, () ->
                sellerListingService.deleteListing(sellerA.getId(), listingB.getId()));
    }

    @Test
    @DisplayName("Optimistic Concurrency Control: Stale version update must fail with OptimisticLockConflictException")
    void testOptimisticLocking_StaleVersionFails() {
        CreateListingRequest createRequest = CreateListingRequest.builder()
                .productId(testProduct.getId())
                .price(BigDecimal.valueOf(400.00))
                .availableStock(50)
                .minOrderQuantity(1)
                .build();

        ListingResponseDTO listing = sellerListingService.createListing(sellerA.getId(), createRequest);

        // Intentionally provide a stale version (e.g. version + 99)
        UpdateListingRequest staleUpdate = UpdateListingRequest.builder()
                .price(BigDecimal.valueOf(450.00))
                .availableStock(40)
                .minOrderQuantity(1)
                .status(ListingStatus.ACTIVE)
                .version(listing.getVersion() + 99)
                .build();

        assertThrows(OptimisticLockConflictException.class, () ->
                sellerListingService.updateListing(sellerA.getId(), listing.getId(), staleUpdate));
    }
}

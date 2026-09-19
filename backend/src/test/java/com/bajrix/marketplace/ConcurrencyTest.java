package com.bajrix.marketplace;

import com.bajrix.marketplace.domain.entity.Category;
import com.bajrix.marketplace.domain.entity.Product;
import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.UpdateListingRequest;
import com.bajrix.marketplace.exception.OptimisticLockConflictException;
import com.bajrix.marketplace.repository.CategoryRepository;
import com.bajrix.marketplace.repository.ProductRepository;
import com.bajrix.marketplace.repository.SellerListingRepository;
import com.bajrix.marketplace.repository.SellerRepository;
import com.bajrix.marketplace.service.SellerListingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.OptimisticLockingFailureException;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ConcurrencyTest {

    @Autowired
    private SellerListingService sellerListingService;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    @DisplayName("Concurrent Updates: Two simultaneous updates on the same listing version must cause one to fail with OptimisticLockConflictException or OptimisticLockingFailureException")
    void testConcurrentUpdates_OptimisticLockingPreventsLostUpdates() throws InterruptedException {
        Category category = categoryRepository.save(Category.builder()
                .name("Concurrency Cat " + UUID.randomUUID())
                .slug("concurrency-cat-" + UUID.randomUUID())
                .build());

        Product product = productRepository.save(Product.builder()
                .name("Concurrency Product " + UUID.randomUUID())
                .brand("Brand Y")
                .sku("SKU-" + UUID.randomUUID())
                .unitOfMeasure("ton")
                .category(category)
                .build());

        Seller seller = sellerRepository.save(Seller.builder()
                .businessName("Concurrency Seller")
                .contactPerson("Person")
                .email("seller-" + UUID.randomUUID() + "@test.com")
                .phone("+91-9999999999")
                .city("Pune")
                .state("MH")
                .status(SellerStatus.APPROVED)
                .build());

        SellerListing listing = sellerListingRepository.save(SellerListing.builder()
                .product(product)
                .seller(seller)
                .price(BigDecimal.valueOf(500.00))
                .availableStock(100)
                .minOrderQuantity(1)
                .status(ListingStatus.ACTIVE)
                .build());

        Long initialVersion = listing.getVersion();
        UUID listingId = listing.getId();
        UUID sellerId = seller.getId();

        int threadCount = 2;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);
        AtomicInteger otherErrorCount = new AtomicInteger(0);

        // Thread 1: attempts to update price to 520 using initialVersion
        executor.submit(() -> {
            try {
                startLatch.await();
                UpdateListingRequest req1 = UpdateListingRequest.builder()
                        .price(BigDecimal.valueOf(520.00))
                        .availableStock(90)
                        .minOrderQuantity(1)
                        .status(ListingStatus.ACTIVE)
                        .version(initialVersion)
                        .build();
                sellerListingService.updateListing(sellerId, listingId, req1);
                successCount.incrementAndGet();
            } catch (OptimisticLockConflictException | OptimisticLockingFailureException ex) {
                conflictCount.incrementAndGet();
            } catch (Throwable t) {
                System.err.println("Thread 1 unexpected error: " + t.getClass().getName() + " - " + t.getMessage());
                otherErrorCount.incrementAndGet();
            } finally {
                endLatch.countDown();
            }
        });

        // Thread 2: attempts to update price to 530 using same initialVersion
        executor.submit(() -> {
            try {
                startLatch.await();
                UpdateListingRequest req2 = UpdateListingRequest.builder()
                        .price(BigDecimal.valueOf(530.00))
                        .availableStock(80)
                        .minOrderQuantity(1)
                        .status(ListingStatus.ACTIVE)
                        .version(initialVersion)
                        .build();
                sellerListingService.updateListing(sellerId, listingId, req2);
                successCount.incrementAndGet();
            } catch (OptimisticLockConflictException | OptimisticLockingFailureException ex) {
                conflictCount.incrementAndGet();
            } catch (Throwable t) {
                System.err.println("Thread 2 unexpected error: " + t.getClass().getName() + " - " + t.getMessage());
                otherErrorCount.incrementAndGet();
            } finally {
                endLatch.countDown();
            }
        });

        // Release both threads simultaneously
        startLatch.countDown();
        endLatch.await();
        executor.shutdown();

        assertEquals(0, otherErrorCount.get(), "There should be no unexpected errors");
        assertEquals(1, successCount.get(), "Exactly one update should succeed");
        assertEquals(1, conflictCount.get(), "Exactly one update should be rejected due to optimistic lock conflict");

        // Verify that database reflects the successful update and incremented version
        SellerListing currentInDb = sellerListingRepository.findById(listingId).orElseThrow();
        assertEquals(initialVersion + 1, currentInDb.getVersion());
    }
}

package com.bajrix.marketplace.repository;

import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerListingRepository extends JpaRepository<SellerListing, UUID> {

    /**
     * Finds all listings for a product offered by APPROVED sellers with ACTIVE listing status,
     * ordered by price ascending (best price first).
     */
    @Query("SELECT sl FROM SellerListing sl " +
           "JOIN FETCH sl.seller s " +
           "JOIN FETCH sl.product p " +
           "WHERE p.id = :productId " +
           "AND s.status = :sellerStatus " +
           "AND sl.status = :listingStatus " +
           "ORDER BY sl.price ASC")
    List<SellerListing> findActiveOfferingsForProduct(
            @Param("productId") UUID productId,
            @Param("sellerStatus") SellerStatus sellerStatus,
            @Param("listingStatus") ListingStatus listingStatus
    );

    /**
     * Finds all listings belonging to a specific seller (for seller dashboard).
     */
    @Query("SELECT sl FROM SellerListing sl " +
           "JOIN FETCH sl.product p " +
           "LEFT JOIN FETCH p.category " +
           "WHERE sl.seller.id = :sellerId " +
           "ORDER BY sl.updatedAt DESC, sl.createdAt DESC")
    List<SellerListing> findAllBySellerId(@Param("sellerId") UUID sellerId);

    /**
     * Finds a single listing by its ID and seller ID (for seller data isolation).
     */
    Optional<SellerListing> findByIdAndSellerId(UUID id, UUID sellerId);

    /**
     * Checks if a listing already exists for this seller and product.
     */
    boolean existsBySellerIdAndProductId(UUID sellerId, UUID productId);

    /**
     * Count listings for a specific seller.
     */
    long countBySellerId(UUID sellerId);
}

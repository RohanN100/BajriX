package com.bajrix.marketplace.repository;

import com.bajrix.marketplace.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    /**
     * Search products with optional category and search query filters.
     * Uses case-insensitive search across name, brand, and SKU.
     */
    @Query("SELECT p FROM Product p " +
           "JOIN FETCH p.category c " +
           "WHERE (:categoryId IS NULL OR c.id = :categoryId) " +
           "AND (:query IS NULL OR :query = '' OR " +
           "     LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "     LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "     LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchProducts(
            @Param("categoryId") UUID categoryId,
            @Param("query") String query,
            Pageable pageable
    );

    /**
     * Finds products not yet listed by a specific seller.
     */
    @Query("SELECT p FROM Product p " +
           "JOIN FETCH p.category c " +
           "WHERE p.id NOT IN (SELECT sl.product.id FROM SellerListing sl WHERE sl.seller.id = :sellerId)")
    List<Product> findProductsNotListedBySeller(@Param("sellerId") UUID sellerId);
}

package com.bajrix.marketplace.service;

import com.bajrix.marketplace.domain.entity.Product;
import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.CreateListingRequest;
import com.bajrix.marketplace.dto.ListingResponseDTO;
import com.bajrix.marketplace.dto.UpdateListingRequest;
import com.bajrix.marketplace.exception.*;
import com.bajrix.marketplace.repository.ProductRepository;
import com.bajrix.marketplace.repository.SellerListingRepository;
import com.bajrix.marketplace.repository.SellerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SellerListingService {

    private final SellerListingRepository sellerListingRepository;
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;

    public SellerListingService(SellerListingRepository sellerListingRepository,
                                SellerRepository sellerRepository,
                                ProductRepository productRepository) {
        this.sellerListingRepository = sellerListingRepository;
        this.sellerRepository = sellerRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ListingResponseDTO> getMyListings(UUID sellerId) {
        verifySellerExists(sellerId);
        return sellerListingRepository.findAllBySellerId(sellerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ListingResponseDTO createListing(UUID sellerId, CreateListingRequest request) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        // Business Rule: REJECTED sellers cannot add new listings
        if (seller.getStatus() == SellerStatus.REJECTED) {
            throw new SellerNotApprovedException("Rejected sellers are not permitted to add product listings.");
        }

        // Business Rule: Prevent duplicate listings for the same product by the same seller
        if (sellerListingRepository.existsBySellerIdAndProductId(sellerId, request.getProductId())) {
            throw new DuplicateListingException("You already have an active listing for this product. Update your existing listing instead.");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        ListingStatus initialStatus = request.getStatus() != null ? request.getStatus() : ListingStatus.ACTIVE;
        if (request.getAvailableStock() == 0 && initialStatus == ListingStatus.ACTIVE) {
            initialStatus = ListingStatus.OUT_OF_STOCK;
        }

        SellerListing listing = SellerListing.builder()
                .product(product)
                .seller(seller)
                .price(request.getPrice())
                .availableStock(request.getAvailableStock())
                .minOrderQuantity(request.getMinOrderQuantity())
                .status(initialStatus)
                .build();

        SellerListing saved = sellerListingRepository.save(listing);
        return mapToDTO(saved);
    }

    @Transactional
    public ListingResponseDTO updateListing(UUID sellerId, UUID listingId, UpdateListingRequest request) {
        SellerListing listing = sellerListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        // Business Rule & Authorization: Enforce strict seller data isolation
        if (!listing.getSeller().getId().equals(sellerId)) {
            throw new UnauthorizedSellerAccessException("Access denied: You cannot modify listings belonging to another seller.");
        }

        // Concurrency Control: Optimistic locking version verification
        if (request.getVersion() == null || !request.getVersion().equals(listing.getVersion())) {
            throw new OptimisticLockConflictException(
                    "Listing has been updated by another session (expected version: " +
                    request.getVersion() + ", actual version: " + listing.getVersion() + "). Please reload before modifying.");
        }

        listing.setPrice(request.getPrice());
        listing.setAvailableStock(request.getAvailableStock());
        listing.setMinOrderQuantity(request.getMinOrderQuantity());

        // Automatic status adjustment based on stock level if currently ACTIVE
        ListingStatus targetStatus = request.getStatus();
        if (request.getAvailableStock() == 0 && targetStatus == ListingStatus.ACTIVE) {
            targetStatus = ListingStatus.OUT_OF_STOCK;
        } else if (request.getAvailableStock() > 0 && targetStatus == ListingStatus.OUT_OF_STOCK) {
            targetStatus = ListingStatus.ACTIVE;
        }
        listing.setStatus(targetStatus);

        SellerListing updated = sellerListingRepository.save(listing);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteListing(UUID sellerId, UUID listingId) {
        SellerListing listing = sellerListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        // Seller data isolation
        if (!listing.getSeller().getId().equals(sellerId)) {
            throw new UnauthorizedSellerAccessException("Access denied: You cannot delete listings belonging to another seller.");
        }

        sellerListingRepository.delete(listing);
    }

    private void verifySellerExists(UUID sellerId) {
        if (!sellerRepository.existsById(sellerId)) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }
    }

    public ListingResponseDTO mapToDTO(SellerListing listing) {
        return ListingResponseDTO.builder()
                .id(listing.getId())
                .productId(listing.getProduct().getId())
                .productName(listing.getProduct().getName())
                .productBrand(listing.getProduct().getBrand())
                .productSku(listing.getProduct().getSku())
                .unitOfMeasure(listing.getProduct().getUnitOfMeasure())
                .categoryName(listing.getProduct().getCategory() != null ? listing.getProduct().getCategory().getName() : null)
                .imageUrl(listing.getProduct().getImageUrl())
                .sellerId(listing.getSeller().getId())
                .sellerBusinessName(listing.getSeller().getBusinessName())
                .price(listing.getPrice())
                .availableStock(listing.getAvailableStock())
                .minOrderQuantity(listing.getMinOrderQuantity())
                .status(listing.getStatus())
                .version(listing.getVersion())
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }
}

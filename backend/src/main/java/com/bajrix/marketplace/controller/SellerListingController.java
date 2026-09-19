package com.bajrix.marketplace.controller;

import com.bajrix.marketplace.dto.CreateListingRequest;
import com.bajrix.marketplace.dto.ListingResponseDTO;
import com.bajrix.marketplace.dto.ProductSummaryDTO;
import com.bajrix.marketplace.dto.UpdateListingRequest;
import com.bajrix.marketplace.exception.InvalidOperationException;
import com.bajrix.marketplace.service.ProductCatalogService;
import com.bajrix.marketplace.service.SellerListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/seller/listings")
@CrossOrigin(origins = "*")
public class SellerListingController {

    private final SellerListingService sellerListingService;
    private final ProductCatalogService productCatalogService;

    public SellerListingController(SellerListingService sellerListingService,
                                   ProductCatalogService productCatalogService) {
        this.sellerListingService = sellerListingService;
        this.productCatalogService = productCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<ListingResponseDTO>> getMyListings(
            @RequestHeader(value = "X-Seller-Id", required = false) UUID sellerHeaderId,
            @RequestParam(value = "sellerId", required = false) UUID sellerParamId
    ) {
        UUID activeSellerId = resolveSellerId(sellerHeaderId, sellerParamId);
        List<ListingResponseDTO> listings = sellerListingService.getMyListings(activeSellerId);
        return ResponseEntity.ok(listings);
    }

    @PostMapping
    public ResponseEntity<ListingResponseDTO> createListing(
            @RequestHeader(value = "X-Seller-Id", required = false) UUID sellerHeaderId,
            @RequestParam(value = "sellerId", required = false) UUID sellerParamId,
            @Valid @RequestBody CreateListingRequest request
    ) {
        UUID activeSellerId = resolveSellerId(sellerHeaderId, sellerParamId);
        ListingResponseDTO response = sellerListingService.createListing(activeSellerId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{listingId}")
    public ResponseEntity<ListingResponseDTO> updateListing(
            @RequestHeader(value = "X-Seller-Id", required = false) UUID sellerHeaderId,
            @RequestParam(value = "sellerId", required = false) UUID sellerParamId,
            @PathVariable UUID listingId,
            @Valid @RequestBody UpdateListingRequest request
    ) {
        UUID activeSellerId = resolveSellerId(sellerHeaderId, sellerParamId);
        ListingResponseDTO response = sellerListingService.updateListing(activeSellerId, listingId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Void> deleteListing(
            @RequestHeader(value = "X-Seller-Id", required = false) UUID sellerHeaderId,
            @RequestParam(value = "sellerId", required = false) UUID sellerParamId,
            @PathVariable UUID listingId
    ) {
        UUID activeSellerId = resolveSellerId(sellerHeaderId, sellerParamId);
        sellerListingService.deleteListing(activeSellerId, listingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unlisted-products")
    public ResponseEntity<List<ProductSummaryDTO>> getUnlistedProducts(
            @RequestHeader(value = "X-Seller-Id", required = false) UUID sellerHeaderId,
            @RequestParam(value = "sellerId", required = false) UUID sellerParamId
    ) {
        UUID activeSellerId = resolveSellerId(sellerHeaderId, sellerParamId);
        List<ProductSummaryDTO> unlisted = productCatalogService.getUnlistedProductsForSeller(activeSellerId);
        return ResponseEntity.ok(unlisted);
    }

    private UUID resolveSellerId(UUID headerId, UUID paramId) {
        if (headerId != null) return headerId;
        if (paramId != null) return paramId;
        throw new InvalidOperationException("X-Seller-Id header or sellerId query parameter is required to identify the operating seller.");
    }
}

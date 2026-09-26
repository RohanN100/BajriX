package com.bajrix.marketplace.service;

import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.dto.AdminSellerListingDTO;
import com.bajrix.marketplace.exception.ResourceNotFoundException;
import com.bajrix.marketplace.repository.SellerListingRepository;
import com.bajrix.marketplace.repository.SellerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminSellerService {

    private final SellerRepository sellerRepository;
    private final SellerListingRepository sellerListingRepository;

    public AdminSellerService(
            SellerRepository sellerRepository,
            SellerListingRepository sellerListingRepository
    ) {
        this.sellerRepository = sellerRepository;
        this.sellerListingRepository = sellerListingRepository;
    }

    public List<AdminSellerListingDTO> getSellerListings(UUID sellerId) {

        if (!sellerRepository.existsById(sellerId)) {
            throw new ResourceNotFoundException(
                    "Seller not found with id: " + sellerId
            );
        }

        List<SellerListing> listings =
                sellerListingRepository.findBySellerId(sellerId);

        return listings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AdminSellerListingDTO mapToDTO(SellerListing listing) {

        return new AdminSellerListingDTO(
                listing.getId(),
                listing.getProduct().getId(),
                listing.getProduct().getName(),
                listing.getProduct().getBrand(),
                listing.getPrice(),
                listing.getAvailableStock(),
                listing.getMinOrderQuantity(),
                listing.getStatus(),
                listing.getVersion()
        );
    }
}
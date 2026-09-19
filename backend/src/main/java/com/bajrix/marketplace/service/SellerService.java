package com.bajrix.marketplace.service;

import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.SellerSummaryDTO;
import com.bajrix.marketplace.exception.ResourceNotFoundException;
import com.bajrix.marketplace.repository.SellerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    public List<SellerSummaryDTO> getAllSellers() {
        return sellerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Seller getSellerEntity(UUID sellerId) {
        return sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));
    }

    public SellerSummaryDTO getSellerById(UUID sellerId) {
        return mapToDTO(getSellerEntity(sellerId));
    }

    public List<SellerSummaryDTO> getSellersByStatus(SellerStatus status) {
        return sellerRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SellerSummaryDTO mapToDTO(Seller seller) {
        return SellerSummaryDTO.builder()
                .id(seller.getId())
                .businessName(seller.getBusinessName())
                .contactPerson(seller.getContactPerson())
                .email(seller.getEmail())
                .phone(seller.getPhone())
                .city(seller.getCity())
                .state(seller.getState())
                .gstNumber(seller.getGstNumber())
                .status(seller.getStatus())
                .rating(seller.getRating())
                .build();
    }
}

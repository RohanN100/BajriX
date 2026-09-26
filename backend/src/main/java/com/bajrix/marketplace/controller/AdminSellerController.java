package com.bajrix.marketplace.controller;


import com.bajrix.marketplace.service.AdminSellerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bajrix.marketplace.dto.AdminSellerListingDTO;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/sellers")
@CrossOrigin(origins = "*")
public class AdminSellerController {

    private final AdminSellerService adminSellerService;

    public AdminSellerController(AdminSellerService adminSellerService) {
        this.adminSellerService = adminSellerService;
    }

    @GetMapping("/{sellerId}/listings")
    public ResponseEntity<List<AdminSellerListingDTO>> getSellerListings(
            @PathVariable UUID sellerId
    ) {
        return ResponseEntity.ok(
                adminSellerService.getSellerListings(sellerId)
        );
    }
}
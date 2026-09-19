package com.bajrix.marketplace.controller;

import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.SellerSummaryDTO;
import com.bajrix.marketplace.service.SellerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sellers")
@CrossOrigin(origins = "*")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @GetMapping
    public ResponseEntity<List<SellerSummaryDTO>> getAllSellers(
            @RequestParam(required = false) SellerStatus status
    ) {
        if (status != null) {
            return ResponseEntity.ok(sellerService.getSellersByStatus(status));
        }
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SellerSummaryDTO> getSellerById(@PathVariable UUID id) {
        return ResponseEntity.ok(sellerService.getSellerById(id));
    }
}

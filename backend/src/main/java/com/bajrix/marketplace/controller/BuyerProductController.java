package com.bajrix.marketplace.controller;

import com.bajrix.marketplace.dto.CategoryDTO;
import com.bajrix.marketplace.dto.ProductDetailDTO;
import com.bajrix.marketplace.dto.ProductSummaryDTO;
import com.bajrix.marketplace.service.ProductCatalogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*")
public class BuyerProductController {

    private final ProductCatalogService productCatalogService;

    public BuyerProductController(ProductCatalogService productCatalogService) {
        this.productCatalogService = productCatalogService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductSummaryDTO>> browseProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductSummaryDTO> products = productCatalogService.searchProducts(categoryId, query, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetails(@PathVariable UUID id) {
        ProductDetailDTO productDetails = productCatalogService.getProductDetails(id);
        return ResponseEntity.ok(productDetails);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(productCatalogService.getAllCategories());
    }
}

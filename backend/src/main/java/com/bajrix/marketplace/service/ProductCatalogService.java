package com.bajrix.marketplace.service;

import com.bajrix.marketplace.domain.entity.Category;

import com.bajrix.marketplace.domain.entity.Product;
import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.dto.CategoryDTO;
import com.bajrix.marketplace.dto.ProductDetailDTO;
import com.bajrix.marketplace.dto.ProductSummaryDTO;
import com.bajrix.marketplace.dto.SellerOfferingDTO;
import com.bajrix.marketplace.exception.ResourceNotFoundException;
import com.bajrix.marketplace.repository.CategoryRepository;
import com.bajrix.marketplace.repository.ProductRepository;
import com.bajrix.marketplace.repository.SellerListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.bajrix.marketplace.dto.CreateProductRequest;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional(readOnly = true)
public class ProductCatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SellerListingRepository sellerListingRepository;

    public ProductCatalogService(ProductRepository productRepository,
                                 CategoryRepository categoryRepository,
                                 SellerListingRepository sellerListingRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.sellerListingRepository = sellerListingRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToDTO)
                .collect(Collectors.toList());
    }

    public Page<ProductSummaryDTO> searchProducts(UUID categoryId, String query, Pageable pageable) {
        Page<Product> productsPage = productRepository.searchProducts(categoryId, query, pageable);

        List<ProductSummaryDTO> summaryDTOs = productsPage.getContent().stream()
                .map(this::enrichProductSummary)
                .collect(Collectors.toList());

        return new PageImpl<>(summaryDTOs, pageable, productsPage.getTotalElements());
    }

    public ProductDetailDTO getProductDetails(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Critical rule: Only fetch listings where Seller is APPROVED and Listing is ACTIVE
        List<SellerListing> activeOfferings = sellerListingRepository.findActiveOfferingsForProduct(
                productId, SellerStatus.APPROVED, ListingStatus.ACTIVE);

        BigDecimal lowestPrice = activeOfferings.isEmpty() ? null : activeOfferings.get(0).getPrice();

        List<SellerOfferingDTO> offeringDTOs = activeOfferings.stream()
                .map(listing -> mapToOfferingDTO(listing, lowestPrice))
                .collect(Collectors.toList());

        ProductSummaryDTO summary = enrichProductSummary(product);

        return ProductDetailDTO.builder()
                .product(summary)
                .offerings(offeringDTOs)
                .build();
    }

    public List<ProductSummaryDTO> getUnlistedProductsForSeller(UUID sellerId) {
        return productRepository.findProductsNotListedBySeller(sellerId).stream()
                .map(this::mapToBasicSummary)
                .collect(Collectors.toList());
    }

    public ProductSummaryDTO enrichProductSummary(Product product) {
        List<SellerListing> offerings = sellerListingRepository.findActiveOfferingsForProduct(
                product.getId(), SellerStatus.APPROVED, ListingStatus.ACTIVE);

        int activeSellersCount = offerings.size();
        BigDecimal minPrice = offerings.isEmpty() ? null : offerings.get(0).getPrice();
        BigDecimal maxPrice = offerings.isEmpty() ? null : offerings.stream()
                .map(SellerListing::getPrice)
                .max(BigDecimal::compareTo)
                .orElse(null);
        int totalAvailableStock = offerings.stream()
                .mapToInt(SellerListing::getAvailableStock)
                .sum();

        return ProductSummaryDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .sku(product.getSku())
                .unitOfMeasure(product.getUnitOfMeasure())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .category(mapCategoryToDTO(product.getCategory()))
                .activeSellersCount(activeSellersCount)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .totalAvailableStock(totalAvailableStock)
                .inStock(totalAvailableStock > 0)
                .build();
    }

    private ProductSummaryDTO mapToBasicSummary(Product product) {
        return ProductSummaryDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .sku(product.getSku())
                .unitOfMeasure(product.getUnitOfMeasure())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .category(mapCategoryToDTO(product.getCategory()))
                .activeSellersCount(0)
                .minPrice(null)
                .maxPrice(null)
                .totalAvailableStock(0)
                .inStock(false)
                .build();
    }

    private SellerOfferingDTO mapToOfferingDTO(SellerListing listing, BigDecimal lowestPrice) {
        boolean isLowest = lowestPrice != null && listing.getPrice().compareTo(lowestPrice) == 0;
        return SellerOfferingDTO.builder()
                .listingId(listing.getId())
                .sellerId(listing.getSeller().getId())
                .sellerName(listing.getSeller().getBusinessName())
                .sellerRating(listing.getSeller().getRating())
                .sellerCity(listing.getSeller().getCity())
                .sellerState(listing.getSeller().getState())
                .sellerStatus(listing.getSeller().getStatus())
                .price(listing.getPrice())
                .availableStock(listing.getAvailableStock())
                .minOrderQuantity(listing.getMinOrderQuantity())
                .listingStatus(listing.getStatus())
                .version(listing.getVersion())
                .lowestPrice(isLowest)
                .build();
    }

    private CategoryDTO mapCategoryToDTO(Category category) {
        if (category == null) return null;
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .icon(category.getIcon())
                .description(category.getDescription())
                .build();
    }
    
    @Transactional
    public ProductSummaryDTO createProduct(CreateProductRequest request) {

        String sku = request.getSku().trim();

        if (productRepository.existsBySku(sku)) {
            throw new IllegalArgumentException(
                    "Product with SKU already exists: " + sku
            );
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()
                ));

        Product product = Product.builder()
                .name(request.getName().trim())
                .brand(request.getBrand().trim())
                .sku(sku)
                .unitOfMeasure(request.getUnitOfMeasure().trim())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);

        return enrichProductSummary(savedProduct);
    }
}

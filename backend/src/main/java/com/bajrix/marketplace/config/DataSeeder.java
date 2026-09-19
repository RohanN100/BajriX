package com.bajrix.marketplace.config;

import com.bajrix.marketplace.domain.entity.Category;
import com.bajrix.marketplace.domain.entity.Product;
import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.entity.SellerListing;
import com.bajrix.marketplace.domain.enums.ListingStatus;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import com.bajrix.marketplace.repository.CategoryRepository;
import com.bajrix.marketplace.repository.ProductRepository;
import com.bajrix.marketplace.repository.SellerListingRepository;
import com.bajrix.marketplace.repository.SellerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final SellerListingRepository sellerListingRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      SellerRepository sellerRepository,
                      SellerListingRepository sellerListingRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.sellerRepository = sellerRepository;
        this.sellerListingRepository = sellerListingRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (sellerRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data population.");
            return;
        }

        log.info("Seeding realistic marketplace sample data...");

        // 1. Categories
        Category cementCat = categoryRepository.save(Category.builder()
                .name("Cement & Binding")
                .slug("cement-binding")
                .description("Ordinary Portland Cement, Pozzolana Portland Cement, and Rapid Hardening Cement")
                .icon("Package")
                .build());

        Category steelCat = categoryRepository.save(Category.builder()
                .name("Steel & TMT Bars")
                .slug("steel-tmt")
                .description("Thermo-Mechanically Treated rebars, structural steel sections, and binding wires")
                .icon("Shield")
                .build());

        Category aggregatesCat = categoryRepository.save(Category.builder()
                .name("Aggregates & Sand")
                .slug("aggregates-sand")
                .description("Washed river sand, M-sand, crushed blue metal stone, and gravel")
                .icon("Layers")
                .build());

        Category bricksCat = categoryRepository.save(Category.builder()
                .name("Bricks & Blocks")
                .slug("bricks-blocks")
                .description("Red clay bricks, fly ash bricks, and AAC lightweight blocks")
                .icon("Box")
                .build());

        Category tilesCat = categoryRepository.save(Category.builder()
                .name("Tiles & Flooring")
                .slug("tiles-flooring")
                .description("Vitrified tiles, ceramic wall tiles, granite slabs, and adhesive compounds")
                .icon("Grid")
                .build());

        // 2. Sellers with varying statuses
        Seller shreeTraders = sellerRepository.save(Seller.builder()
                .businessName("Shree Traders")
                .contactPerson("Rajesh Patel")
                .email("rajesh@shreetraders.com")
                .phone("+91-9823011223")
                .city("Pune")
                .state("Maharashtra")
                .gstNumber("27AAACS1429B1ZB")
                .status(SellerStatus.APPROVED)
                .rating(BigDecimal.valueOf(4.8))
                .build());

        Seller rathoreMaterials = sellerRepository.save(Seller.builder()
                .businessName("Rathore Building Materials")
                .contactPerson("Vikram Rathore")
                .email("vikram@rathorematerials.com")
                .phone("+91-9811445566")
                .city("Mumbai")
                .state("Maharashtra")
                .gstNumber("27AABCR8821C1Z4")
                .status(SellerStatus.APPROVED)
                .rating(BigDecimal.valueOf(4.6))
                .build());

        Seller aggarwalSteel = sellerRepository.save(Seller.builder()
                .businessName("Aggarwal Cement & Steel")
                .contactPerson("Suresh Aggarwal")
                .email("suresh@aggarwalsteel.com")
                .phone("+91-9876543210")
                .city("Delhi NCR")
                .state("Delhi")
                .gstNumber("07AAACA4932D1Z9")
                .status(SellerStatus.APPROVED)
                .rating(BigDecimal.valueOf(4.9))
                .build());

        // PENDING SELLER - Listings MUST NOT be visible to buyers!
        Seller buildRightPending = sellerRepository.save(Seller.builder()
                .businessName("BuildRight Supplies (Pending KYC)")
                .contactPerson("Anil Kumar")
                .email("anil@buildright.in")
                .phone("+91-9711223344")
                .city("Bengaluru")
                .state("Karnataka")
                .gstNumber("29AABCB3344E1Z2")
                .status(SellerStatus.PENDING)
                .rating(BigDecimal.valueOf(4.2))
                .build());

        // REJECTED SELLER - Denied from marketplace operations
        Seller apexRejected = sellerRepository.save(Seller.builder()
                .businessName("Apex Construction Supplies (Rejected)")
                .contactPerson("Dinesh Sharma")
                .email("dinesh@apexsupplies.in")
                .phone("+91-9988776655")
                .city("Ahmedabad")
                .state("Gujarat")
                .gstNumber("24AACCA1122F1ZX")
                .status(SellerStatus.REJECTED)
                .rating(BigDecimal.valueOf(3.1))
                .build());

        // 3. Products
        Product ultratechCement = productRepository.save(Product.builder()
                .name("UltraTech PPC Cement 50 kg")
                .brand("UltraTech")
                .sku("CEM-ULT-PPC-50")
                .unitOfMeasure("bag")
                .category(cementCat)
                .description("Portland Pozzolana Cement engineered with micro-particles for superior durability, corrosion resistance, and high compressive strength.")
                .imageUrl("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80")
                .build());

        Product birlaCement = productRepository.save(Product.builder()
                .name("Birla A1 Premium PPC Cement 50 kg")
                .brand("Birla A1")
                .sku("CEM-BIR-A1-50")
                .unitOfMeasure("bag")
                .category(cementCat)
                .description("Premium quality cement suitable for heavy-duty load-bearing RCC slabs, foundations, and high-rise construction.")
                .imageUrl("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80")
                .build());

        Product tataTmt = productRepository.save(Product.builder()
                .name("Tata Tiscon 550D TMT Rebar 12mm (12m)")
                .brand("Tata Tiscon")
                .sku("STL-TAT-550D-12")
                .unitOfMeasure("ton")
                .category(steelCat)
                .description("Fe 550D high-ductility earthquake-resistant rebars manufactured from virgin iron ore with uniform rib pattern for maximum concrete bonding.")
                .imageUrl("https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80")
                .build());

        Product riverSand = productRepository.save(Product.builder()
                .name("River Sand Grade 1 (Triple Washed)")
                .brand("BajriX Sourced")
                .sku("AGG-RIV-SND-01")
                .unitOfMeasure("ton")
                .category(aggregatesCat)
                .description("Clean river sand free from silt and organic clay, ideal for plastering, brickwork, and grade M20/M25 concrete mixing.")
                .imageUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80")
                .build());

        Product blueMetal = productRepository.save(Product.builder()
                .name("Crushed Stone Aggregate 20mm (Blue Metal)")
                .brand("BajriX Quarries")
                .sku("AGG-CRU-MET-20")
                .unitOfMeasure("ton")
                .category(aggregatesCat)
                .description("Angular crushed granite aggregate graded 20mm down, ensuring optimal interlocking and minimal voids in structural concrete.")
                .imageUrl("https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80")
                .build());

        Product redBricks = productRepository.save(Product.builder()
                .name("Red Clay Solid Bricks (Class 1 Kiln Fired)")
                .brand("Royal Kilns")
                .sku("BRK-RED-CLY-01")
                .unitOfMeasure("piece")
                .category(bricksCat)
                .description("First-class table molded red clay burnt bricks with sharp edges, uniform deep red color, and high compressive strength exceeding 10.5 N/mm².")
                .imageUrl("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80")
                .build());

        Product aacBlocks = productRepository.save(Product.builder()
                .name("Autoclaved Aerated Concrete (AAC) Blocks 600x200x150mm")
                .brand("Siporex")
                .sku("BRK-AAC-600-15")
                .unitOfMeasure("piece")
                .category(bricksCat)
                .description("Thermal insulating lightweight cellular concrete blocks, offering 3x faster wall masonry and up to 20% dead load reduction.")
                .imageUrl("https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80")
                .build());

        Product kajariaTiles = productRepository.save(Product.builder()
                .name("Kajaria 600x600mm Vitrified Floor Tiles (Pack of 4)")
                .brand("Kajaria")
                .sku("TIL-KAJ-600-01")
                .unitOfMeasure("box")
                .category(tilesCat)
                .description("Double-charge vitrified tiles with nano-polish gloss finish, scratch-resistant surface, and less than 0.05% water absorption.")
                .imageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80")
                .build());

        // 4. Seller Listings

        // Case A: UltraTech PPC Cement sold by 3 APPROVED sellers + 1 PENDING seller
        sellerListingRepository.save(SellerListing.builder()
                .product(ultratechCement)
                .seller(shreeTraders)
                .price(BigDecimal.valueOf(390.00))
                .availableStock(500)
                .minOrderQuantity(10)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(ultratechCement)
                .seller(rathoreMaterials)
                .price(BigDecimal.valueOf(385.00))
                .availableStock(120)
                .minOrderQuantity(50)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(ultratechCement)
                .seller(aggarwalSteel)
                .price(BigDecimal.valueOf(405.00))
                .availableStock(1000)
                .minOrderQuantity(5)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(ultratechCement)
                .seller(buildRightPending)
                .price(BigDecimal.valueOf(375.00))
                .availableStock(300)
                .minOrderQuantity(20)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case B: Tata Tiscon 550D TMT Rebar sold by 2 APPROVED sellers
        sellerListingRepository.save(SellerListing.builder()
                .product(tataTmt)
                .seller(shreeTraders)
                .price(BigDecimal.valueOf(68500.00))
                .availableStock(45)
                .minOrderQuantity(1)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(tataTmt)
                .seller(aggarwalSteel)
                .price(BigDecimal.valueOf(67200.00))
                .availableStock(80)
                .minOrderQuantity(2)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case C: River Sand sold by 2 sellers
        sellerListingRepository.save(SellerListing.builder()
                .product(riverSand)
                .seller(rathoreMaterials)
                .price(BigDecimal.valueOf(2400.00))
                .availableStock(250)
                .minOrderQuantity(10)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(riverSand)
                .seller(shreeTraders)
                .price(BigDecimal.valueOf(2550.00))
                .availableStock(80)
                .minOrderQuantity(5)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case D: Red Clay Bricks sold by 3 sellers with different stock levels
        sellerListingRepository.save(SellerListing.builder()
                .product(redBricks)
                .seller(shreeTraders)
                .price(BigDecimal.valueOf(8.50))
                .availableStock(15000)
                .minOrderQuantity(500)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(redBricks)
                .seller(rathoreMaterials)
                .price(BigDecimal.valueOf(8.20))
                .availableStock(8000)
                .minOrderQuantity(1000)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(redBricks)
                .seller(aggarwalSteel)
                .price(BigDecimal.valueOf(9.00))
                .availableStock(25000)
                .minOrderQuantity(200)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case E: Birla A1 Cement
        sellerListingRepository.save(SellerListing.builder()
                .product(birlaCement)
                .seller(rathoreMaterials)
                .price(BigDecimal.valueOf(375.00))
                .availableStock(400)
                .minOrderQuantity(20)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(birlaCement)
                .seller(shreeTraders)
                .price(BigDecimal.valueOf(380.00))
                .availableStock(350)
                .minOrderQuantity(15)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case F: Blue Metal Crushed Stone
        sellerListingRepository.save(SellerListing.builder()
                .product(blueMetal)
                .seller(rathoreMaterials)
                .price(BigDecimal.valueOf(1850.00))
                .availableStock(500)
                .minOrderQuantity(15)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case G: Kajaria Tiles
        sellerListingRepository.save(SellerListing.builder()
                .product(kajariaTiles)
                .seller(aggarwalSteel)
                .price(BigDecimal.valueOf(620.00))
                .availableStock(300)
                .minOrderQuantity(10)
                .status(ListingStatus.ACTIVE)
                .build());

        // Case H: AAC Blocks
        sellerListingRepository.save(SellerListing.builder()
                .product(aacBlocks)
                .seller(aggarwalSteel)
                .price(BigDecimal.valueOf(58.00))
                .availableStock(4000)
                .minOrderQuantity(100)
                .status(ListingStatus.ACTIVE)
                .build());

        sellerListingRepository.save(SellerListing.builder()
                .product(aacBlocks)
                .seller(buildRightPending)
                .price(BigDecimal.valueOf(55.00))
                .availableStock(2000)
                .minOrderQuantity(150)
                .status(ListingStatus.ACTIVE)
                .build());

        log.info("Marketplace sample data successfully seeded!");
    }
}

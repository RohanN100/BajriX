# BajriX — Construction & Home-Building Products Marketplace

A full-stack marketplace application designed to connect buyers with construction and home-building product suppliers. BajriX supports product discovery, seller-specific listings, price and stock comparison, and minimum order quantity (MOQ) handling.

The application is designed around a scalable marketplace architecture where a single product can have multiple seller listings, each with its own price, stock, minimum order quantity, and availability status.

---

## 🚀 Project Overview

BajriX addresses a common marketplace requirement: the same product may be offered by multiple sellers at different prices and quantities.

Instead of duplicating product information for every seller, the system separates:

* **Product:** Common product information, such as name and category.
* **Seller Listing:** Seller-specific details, such as price, stock, minimum order quantity, and listing status.

This design improves data consistency, supports seller comparison, and provides a foundation for scaling a multi-seller marketplace.

---

## ✨ Key Features

### 👤 Buyer Features

* Browse construction and home-building products.
* Search products using relevant keywords.
* Filter and sort product results.
* View paginated product listings.
* Compare offers from different sellers.
* Display the best available offer.
* View seller-specific price, stock, and minimum order quantity.
* Calculate purchasing requirements based on MOQ and available stock.

### 🏪 Seller Features

* View seller-specific listings.
* Create and manage product listings.
* Update listing price, stock, and minimum order quantity.
* Manage listing availability and status.
* Maintain seller-specific listing information.

### 👨‍💼 Admin Features

* View all sellers available on the marketplace.
* View seller information and seller status.
* View the complete product catalogue.
* View product details and available seller offerings.
* Select a particular seller and view their product listings.
* View seller-specific product price, stock, MOQ, and listing status.
* Access seller listings through a dedicated admin API.
* Monitor marketplace sellers and products from an admin dashboard.

### ⚙️ Backend Features

* Layered Spring Boot architecture.
* RESTful API design.
* Product and seller listing separation.
* Approved-seller visibility handling.
* Seller-specific data isolation using seller context.
* Pagination, filtering, and sorting support.
* Optimistic locking for concurrent listing updates.
* PostgreSQL database integration.
* H2 database fallback for development and testing.

---

## 🏗️ Technology Stack

| Layer                | Technologies                 |
| -------------------- | ---------------------------- |
| Frontend             | React.js, Vite, Tailwind CSS |
| Backend              | Java, Spring Boot            |
| API                  | REST APIs                    |
| Database             | PostgreSQL                   |
| Development Database | H2 fallback                  |
| ORM / Persistence    | Spring Data JPA / Hibernate  |
| Build Tool           | Maven                        |
| Development Tools    | VS Code, Spring Tool Suite   |
| Version Control      | Git and GitHub               |

---

## 🧩 System Architecture

The application follows a layered backend architecture.

```text
                    ┌─────────────────────────┐
                    │       React Frontend    │
                    │      Vite + Tailwind    │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │      Spring Boot API    │
                    ├─────────────────────────┤
                    │       Controllers       │
                    ├─────────────────────────┤
                    │        Services         │
                    ├─────────────────────────┤
                    │      Repositories       │
                    ├─────────────────────────┤
                    │    Domain / Entities    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       PostgreSQL        │
                    │     Relational Data     │
                    └─────────────────────────┘




                    Backend Layers
Controller Layer: Handles HTTP requests and API responses.
Service Layer: Contains business logic and application rules.
Repository Layer: Handles database operations.
Entity / Domain Layer: Represents products, sellers, and seller listings.
Database Layer: Stores marketplace data in PostgreSQL.
🗃️ Core Data Model

The application separates canonical product information from seller-specific offers.

Product
   │
   │ 1-to-many
   ▼
SellerListing
   │
   │ belongs to
   ▼
Seller
Product

Stores common information about a product.

Examples:

Product name
Product category
Product description
Product-related information
Seller

Represents a supplier or seller in the marketplace.

SellerListing

Stores seller-specific information for a product.

Examples:

Product reference
Seller reference
Selling price
Available stock
Minimum order quantity (MOQ)
Listing status
Design Benefit

Separating Product and SellerListing allows multiple sellers to offer the same product without duplicating the common product information.

🔌 API Endpoints

The backend provides REST APIs for product discovery, seller management, listing operations, and admin marketplace management.

Product APIs
Method	Endpoint	Purpose
GET	/api/v1/products	Retrieve products with search, filtering, pagination, and sorting
GET	/api/v1/products/{id}	Retrieve product details and seller offerings
GET	/api/v1/products/categories	Retrieve product categories
POST	/api/v1/products	Create a new product in the product catalogue
Seller Listing APIs
Method	Endpoint	Purpose
GET	/api/v1/seller/listings	Retrieve seller listings
POST	/api/v1/seller/listings	Create a seller listing
PUT	/api/v1/seller/listings/{id}	Update a seller listing
DELETE	/api/v1/seller/listings/{id}	Delete a seller listing
GET	/api/v1/seller/listings/unlisted-products	Retrieve products not yet listed by seller
Seller APIs
Method	Endpoint	Purpose
GET	/api/v1/sellers	Retrieve seller-related information
GET	/api/v1/sellers/{id}	Retrieve details of a specific seller
Admin APIs
Method	Endpoint	Purpose
GET	/api/v1/admin/sellers/{sellerId}/listings	Retrieve all product listings belonging to a specific seller
Admin Marketplace Flow

The admin dashboard uses the existing seller and product APIs together with the dedicated admin seller-listings API.

Admin Dashboard
      │
      ├── GET /api/v1/sellers
      │       ↓
      │   View All Sellers
      │
      ├── GET /api/v1/sellers/{id}
      │       ↓
      │   View Seller Information
      │
      ├── GET /api/v1/products
      │       ↓
      │   View Product Catalogue
      │
      ├── GET /api/v1/products/{id}
      │       ↓
      │   View Product Details & Seller Offers
      │
      └── GET /api/v1/admin/sellers/{sellerId}/listings
              ↓
          View Seller's Products

For example, when an admin selects a seller:

Seller List
     ↓
Select Seller
     ↓
Seller ID
     ↓
GET /api/v1/admin/sellers/{sellerId}/listings
     ↓
Seller's Product Listings

The admin can view information such as:

Product name
Product brand
Product ID
Price
Available stock
Minimum order quantity
Listing status
Listing version

Note: The endpoint descriptions should be verified against the actual implementation before submission. Remove any endpoint that is not available in the current codebase.

🔐 Data Isolation and Concurrency Handling
Seller-Specific Data Isolation

Seller-related operations use seller context to help ensure that a seller accesses the appropriate listing data.

The implementation supports seller-specific isolation through the X-Seller-Id request header where applicable.

Example:

X-Seller-Id: SELLER_UUID

The seller listing APIs ensure that seller operations are performed in the context of the selected seller.

The admin seller-listings endpoint uses the seller ID in the URL to retrieve listings belonging to the selected seller.

Example:

GET /api/v1/admin/sellers/{sellerId}/listings

Production-grade authentication and role-based authorization are not implemented as part of the challenge. The current implementation uses a mocked seller context for seller operations.

Optimistic Locking

The application uses optimistic locking through JPA's @Version mechanism for relevant listing updates.

This helps detect conflicting updates when multiple operations attempt to modify the same record.

A conflicting update can result in an HTTP 409 Conflict response, depending on the implemented exception-handling flow.

🗄️ Database

The project uses PostgreSQL as its primary database.

The database setup includes:

Relational product and seller data.
Product-to-listing relationships.
Database schema and indexes.
SQL initialization files such as schema.sql and data.sql, where applicable.
Database Configuration

Configure the database connection in the appropriate Spring Boot configuration file.

Example:

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bajrix
    username: YOUR_DATABASE_USERNAME
    password: YOUR_DATABASE_PASSWORD

Do not commit real database passwords, API keys, or other secrets to GitHub.

📁 Project Structure
bajrix-marketplace/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/bajrix/marketplace/
│   │   │   │       ├── controller/
│   │   │   │       │   ├── BuyerProductController.java
│   │   │   │       │   ├── SellerController.java
│   │   │   │       │   ├── SellerListingController.java
│   │   │   │       │   └── AdminSellerController.java
│   │   │   │       │
│   │   │   │       ├── service/
│   │   │   │       │   ├── ProductCatalogService.java
│   │   │   │       │   ├── SellerListingService.java
│   │   │   │       │   ├── SellerService.java
│   │   │   │       │   └── AdminSellerService.java
│   │   │   │       │
│   │   │   │       └── dto/
│   │   │   │           └── AdminSellerListingDTO.java
│   │   │   │
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       └── AdminDashboard.css
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── db/
│   ├── schema.sql
│   ├── data.sql
│   └── ...
│
├── docker-compose.yml
├── .gitignore
├── AI_USAGE.md
└── README.md
⚙️ Local Setup
Prerequisites

Make sure the following are installed:

Java Development Kit (JDK)
Maven or Maven Wrapper
Node.js and npm
PostgreSQL
Git
1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL

Move into the project directory:

cd bajrix-marketplace
2. Configure the Database
Start PostgreSQL.
Create the required database.
Configure the database URL, username, and password in the backend configuration.
Apply the required schema and seed data, if applicable.

Example database name:

bajrix
3. Run the Backend

Navigate to the backend directory:

cd backend

Run the Spring Boot application through Spring Tool Suite or use the Maven command:

./mvnw spring-boot:run

On Windows, the Maven Wrapper command may be:

mvnw.cmd spring-boot:run

The backend port depends on the application's configuration.

4. Run the Frontend

Open another terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local frontend URL displayed by Vite in your browser.

🧪 Testing and Validation

The project can be validated through the following checks:

Backend application startup.
PostgreSQL database connectivity.
Product API response validation.
Product search and filtering.
Pagination and sorting.
Seller listing operations.
Admin seller listing retrieval.
Admin seller information retrieval.
Admin product catalogue viewing.
MOQ and stock-related calculations.
Concurrent listing update handling.
Frontend-to-backend API integration.

Use the test configuration and commands available in the project for the final validation.

🛡️ Engineering Considerations

The project demonstrates the following software engineering concepts:

Separation of concerns through layered architecture.
RESTful API development.
Relational database modeling.
Product and seller listing normalization.
Pagination, filtering, and sorting.
Seller-specific data handling.
Admin marketplace data visibility.
Optimistic locking for concurrent updates.
Configuration-based database integration.
Frontend and backend separation.
Version control using Git.
🔮 Future Enhancements

Potential future improvements include:

User authentication and role-based authorization.
Dedicated admin authentication and authorization.
Seller onboarding and approval workflows.
Admin seller approval and rejection actions.
Product image management.
Order and cart management.
Payment integration.
Inventory reservation.
Automated integration testing.
API documentation using OpenAPI / Swagger.
Containerized deployment.
Production monitoring and logging.
👨‍💻 Developer

Rohan Gore

Full-Stack Developer | React | Java | Spring Boot | PostgreSQL

Interested in building scalable web applications, marketplace platforms, and practical software solutions.

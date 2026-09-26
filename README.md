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
```

### Backend Layers

* **Controller Layer:** Handles HTTP requests and API responses.
* **Service Layer:** Contains business logic and application rules.
* **Repository Layer:** Handles database operations.
* **Entity / Domain Layer:** Represents products, sellers, and seller listings.
* **Database Layer:** Stores marketplace data in PostgreSQL.

---

## 🗃️ Core Data Model

The application separates canonical product information from seller-specific offers.

```text
Product
   │
   │ 1-to-many
   ▼
SellerListing
   │
   │ belongs to
   ▼
Seller
```

### Product

Stores common information about a product.

Examples:

* Product name
* Product category
* Product description
* Product-related information

### Seller

Represents a supplier or seller in the marketplace.

### SellerListing

Stores seller-specific information for a product.

Examples:

* Product reference
* Seller reference
* Selling price
* Available stock
* Minimum order quantity (MOQ)
* Listing status

### Design Benefit

Separating `Product` and `SellerListing` allows multiple sellers to offer the same product without duplicating the common product information.

---

## 🔌 API Endpoints

The backend provides REST APIs for product discovery, seller management, and listing operations.

### Product APIs

| Method | Endpoint                | Purpose                                                           |
| ------ | ----------------------- | ----------------------------------------------------------------- |
| GET    | `/api/v1/products`      | Retrieve products with search, filtering, pagination, and sorting |
| GET    | `/api/v1/products/{id}` | Retrieve product details, if implemented                          |

### Seller Listing APIs

| Method | Endpoint                       | Purpose                                 |
| ------ | ------------------------------ | --------------------------------------- |
| GET    | `/api/v1/seller/listings`      | Retrieve seller listings                |
| POST   | `/api/v1/seller/listings`      | Create a seller listing, if implemented |
| PUT    | `/api/v1/seller/listings/{id}` | Update a seller listing, if implemented |
| DELETE | `/api/v1/seller/listings/{id}` | Delete a seller listing, if implemented |

### Seller APIs

| Method | Endpoint          | Purpose                             |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/api/v1/sellers` | Retrieve seller-related information |

> **Note:** The endpoint descriptions should be verified against the actual implementation before submission. Remove any endpoint that is not available in the current codebase.

---

## 🔐 Data Isolation and Concurrency Handling

### Seller-Specific Data Isolation

Seller-related operations use seller context to help ensure that a seller accesses the appropriate listing data.

The implementation supports seller-specific isolation through the `X-Seller-Id` request header where applicable.

Example:

```http
X-Seller-Id: 101
```

The exact authentication and authorization behavior should be verified against the deployed implementation.

### Optimistic Locking

The application uses optimistic locking through JPA's `@Version` mechanism for relevant listing updates.

This helps detect conflicting updates when multiple operations attempt to modify the same record.

A conflicting update can result in an HTTP `409 Conflict` response, depending on the implemented exception-handling flow.

---

## 🗄️ Database

The project uses PostgreSQL as its primary database.

The database setup includes:

* Relational product and seller data.
* Product-to-listing relationships.
* Database schema and indexes.
* SQL initialization files such as `schema.sql` and `data.sql`, where applicable.

### Database Configuration

Configure the database connection in the appropriate Spring Boot configuration file.

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bajrix
    username: YOUR_DATABASE_USERNAME
    password: YOUR_DATABASE_PASSWORD
```

**Do not commit real database passwords, API keys, or other secrets to GitHub.**

---

## 📁 Project Structure

```text
bajrix-marketplace/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
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
```

---

## ⚙️ Local Setup

### Prerequisites

Make sure the following are installed:

* Java Development Kit (JDK)
* Maven or Maven Wrapper
* Node.js and npm
* PostgreSQL
* Git

---

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd bajrix-marketplace
```

---

### 2. Configure the Database

1. Start PostgreSQL.
2. Create the required database.
3. Configure the database URL, username, and password in the backend configuration.
4. Apply the required schema and seed data, if applicable.

Example database name:

```text
bajrix
```

---

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application through Spring Tool Suite or use the Maven command:

```bash
./mvnw spring-boot:run
```

On Windows, the Maven Wrapper command may be:

```bash
mvnw.cmd spring-boot:run
```

The backend port depends on the application's configuration.

---

### 4. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local frontend URL displayed by Vite in your browser.

---

## 🧪 Testing and Validation

The project can be validated through the following checks:

* Backend application startup.
* PostgreSQL database connectivity.
* Product API response validation.
* Product search and filtering.
* Pagination and sorting.
* Seller listing operations.
* MOQ and stock-related calculations.
* Concurrent listing update handling.
* Frontend-to-backend API integration.

Use the test configuration and commands available in the project for the final validation.

---

## 🛡️ Engineering Considerations

The project demonstrates the following software engineering concepts:

* Separation of concerns through layered architecture.
* RESTful API development.
* Relational database modeling.
* Product and seller listing normalization.
* Pagination, filtering, and sorting.
* Seller-specific data handling.
* Optimistic locking for concurrent updates.
* Configuration-based database integration.
* Frontend and backend separation.
* Version control using Git.

---

## 🔮 Future Enhancements

Potential future improvements include:

* User authentication and role-based authorization.
* Seller onboarding and approval workflows.
* Product image management.
* Order and cart management.
* Payment integration.
* Inventory reservation.
* Automated integration testing.
* API documentation using OpenAPI / Swagger.
* Containerized deployment.
* Production monitoring and logging.

---

## 👨‍💻 Developer

**Rohan Gore**

Full-Stack Developer | React | Java | Spring Boot | PostgreSQL

Interested in building scalable web applications, marketplace platforms, and practical software solutions.

---

## 📄 License

This project was developed for educational and technical evaluation purposes. Add the appropriate license information if a specific license has been selected.

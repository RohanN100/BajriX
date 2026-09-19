# AI Usage Log - BajriX Engineering Challenge

## 1. AI & Code-Generation Tools Used
- **Antigravity AI (Google DeepMind)**: Used as the primary pair-programming assistant for architecture design, boilerplate generation, Spring Boot entity/service/controller structuring, React component layout, and test suite formulation.

---

## 2. Primary Purposes & Tasks
- **Domain Modeling & ERD**: Defining the structural separation between the canonical catalog entity (`Product`) and vendor-specific offerings (`SellerListing`), as well as the `Seller` verification lifecycle (`APPROVED`, `PENDING`, `REJECTED`).
- **REST API Scaffolding**: Structuring DTOs, request validation rules (Jakarta `@DecimalMin`, `@Min`), global exception handling, and standard HTTP response status mappings (404, 403, 409, 400).
- **Concurrency & Locking**: Implementing JPA `@Version` optimistic locking on `SellerListing` and writing multi-threaded test scenarios simulating concurrent updates on identical listing versions.
- **Frontend UI & Interactive Simulation**: Designing the React application with Tailwind CSS, including side-by-side seller comparison, dynamic order calculator, and an in-browser "Simulate Conflict" button for reviewer evaluation.

---

## 3. Example of Changing, Rejecting, or Correcting AI Suggestions

### Scenario: Lombok Annotation Processing vs. Bleeding-Edge JDK 25 Runtime
- **Initial AI Suggestion**: The assistant initially proposed using Project Lombok (`@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`) across all JPA entities, DTOs, and Spring service components to reduce boilerplate.
- **Problem Encountered**: When compiling against the host environment running Java 25 (`javac [debug parameters release 21]`), Lombok's internal annotation processor crashed during AST transformation with:
  ```text
  Fatal error compiling: java.lang.ExceptionInInitializerError: com.sun.tools.javac.code.TypeTag :: UNKNOWN
  ```
  This is a known issue where Lombok's private bytecode/AST manipulation relies on internal `javac` classes that changed in newer JDK versions.
- **Correction Made**:
  1. **Rejected Lombok entirely**: Removed the Lombok dependency and annotation processor from `pom.xml`.
  2. **Refactored to Standard POJOs**: Implemented explicit constructors, getters, setters, and standard static builder patterns (`Category.builder()`, `SellerListing.builder()`, etc.).
  3. **Adopted Standard Spring Constructor Injection**: Converted `@RequiredArgsConstructor` fields in all controllers and services into clean standard constructor injection.
- **Outcome**: The codebase compiles cleanly across any modern JDK (21, 22, 23, 25+) without proprietary compiler plugins or AST interception risks, resulting in more stable, debuggable, and transparent code.

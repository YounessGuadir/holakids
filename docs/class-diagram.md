# Diagramme de classes HOLAKIDS

```mermaid
classDiagram
direction LR

class BaseEntity {
  +Long id
  +Instant createdAt
  +Instant updatedAt
}

class User {
  +String fullName
  +String email
  +String password
  +Role role
  +boolean enabled
}

class Role {
  <<enumeration>>
  ADMIN
  CLIENT
}

class Category {
  +String slug
  +String nameFr
  +String nameAr
  +String imageUrl
  +boolean active
}

class Product {
  +String externalId
  +String sku
  +String slug
  +String nameFr
  +String nameAr
  +BigDecimal price
  +BigDecimal oldPrice
  +int stock
  +BigDecimal rating
  +boolean featured
  +boolean active
  +getAvailability() Availability
}

class ProductImage {
  +String url
  +String altFr
  +String altAr
  +int position
}

class ProductFeature {
  +String textFr
  +String textAr
  +int position
}

class ProductAttribute {
  +String name
  +String valueFr
  +String valueAr
  +int position
}

class DatasetImportService {
  +load() CatalogDataset
}

class ProductImportService {
  +importDataset(dataset) ImportResult
}

class ProductService {
  +listPublic(...) PageResponse
  +create(request) ProductResponse
  +update(id, request) ProductResponse
  +updateStock(id, request) ProductResponse
  +updatePrice(id, request) ProductResponse
}

class AuthService {
  +register(request) AuthResponse
  +login(request) AuthResponse
}

BaseEntity <|-- User
BaseEntity <|-- Category
BaseEntity <|-- Product
BaseEntity <|-- ProductImage
BaseEntity <|-- ProductFeature
BaseEntity <|-- ProductAttribute
User --> Role
Category "1" --> "0..*" Product
Product "1" *-- "1..*" ProductImage
Product "1" *-- "0..*" ProductFeature
Product "1" *-- "0..*" ProductAttribute
DatasetImportService --> ProductImportService
ProductImportService --> Category
ProductImportService --> Product
ProductService --> Product
AuthService --> User
```

Le mot de passe de `User` contient un hash BCrypt. Le JWT n'est pas persisté : il est signé par le backend et envoyé par le client dans `Authorization: Bearer <token>`.

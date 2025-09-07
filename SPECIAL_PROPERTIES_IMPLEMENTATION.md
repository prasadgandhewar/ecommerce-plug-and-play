# Special Properties Feature Implementation

## Overview
This document outlines the implementation of the new `specialProperties` feature for the e-commerce application, which allows products to be marked as:
- **New Arrivals** (`newArrival: true`)
- **Products with Offers** (`hasOffer: true`) 
- **Best Sellers** (`bestSeller: true`)

## Backend Changes

### 1. New Entity: SpecialProperties
**File**: `BE/ecommerce-api/src/main/java/com/ecommerce/api/entity/SpecialProperties.java`

```java
public class SpecialProperties {
    private Boolean newArrival = false;
    private Boolean hasOffer = false;
    private Boolean bestSeller = false;
    
    // Helper methods for boolean checks
    public boolean isNewArrival() { return newArrival != null && newArrival; }
    public boolean hasOffer() { return hasOffer != null && hasOffer; }
    public boolean isBestSeller() { return bestSeller != null && bestSeller; }
    public boolean hasAnySpecialProperty() { ... }
}
```

### 2. Updated Product Entity
**File**: `BE/ecommerce-api/src/main/java/com/ecommerce/api/entity/Product.java`

Added field:
```java
@Field("specialProperties")
private SpecialProperties specialProperties;
```

### 3. Updated DTOs
**Files**: 
- `ProductRequest.java` - Added `specialProperties` field
- `ProductResponse.java` - Added `specialProperties` field
- `SpecialProductsResponse.java` - New DTO for grouped special products response

### 4. New Repository Methods
**File**: `BE/ecommerce-api/src/main/java/com/ecommerce/api/repository/ProductRepository.java`

```java
// Find products by special property type
@Query("{ 'isActive': true, 'specialProperties.newArrival': true }")
List<Product> findBySpecialPropertiesNewArrivalTrueAndIsActiveTrue(Pageable pageable);

@Query("{ 'isActive': true, 'specialProperties.hasOffer': true }")
List<Product> findBySpecialPropertiesHasOfferTrueAndIsActiveTrue(Pageable pageable);

@Query("{ 'isActive': true, 'specialProperties.bestSeller': true }")
List<Product> findBySpecialPropertiesBestSellerTrueAndIsActiveTrue(Pageable pageable);
```

### 5. New Service Methods
**File**: `BE/ecommerce-api/src/main/java/com/ecommerce/api/service/ProductService.java`

```java
// Get products by specific special property
public List<ProductResponse> getProductsBySpecialProperty(String propertyType, int limit)

// Get all special products grouped by type
public Map<String, List<ProductResponse>> getAllSpecialProducts(int limitPerType)
```

### 6. New API Endpoints
**File**: `BE/ecommerce-api/src/main/java/com/ecommerce/api/controller/ProductController.java`

```java
// Get products by special property type
@GetMapping("/special/{propertyType}")
public ResponseEntity<List<ProductResponse>> getProductsBySpecialProperty(
    @PathVariable String propertyType, @RequestParam(defaultValue = "5") int limit)

// Get all special products in one response
@GetMapping("/special")
public ResponseEntity<Map<String, List<ProductResponse>>> getAllSpecialProducts(
    @RequestParam(defaultValue = "5") int limitPerType)

// Alternative endpoint using SpecialProductsResponse DTO
@GetMapping("/special-grouped")
public ResponseEntity<SpecialProductsResponse> getSpecialProductsGrouped(
    @RequestParam(defaultValue = "5") int limitPerType)
```

## Frontend Changes

### 1. Updated Types
**File**: `FE/packages/web/src/types/index.ts`

```typescript
// New interface for special properties
export interface SpecialProperties {
  newArrival?: boolean;
  hasOffer?: boolean;
  bestSeller?: boolean;
}

// Updated Product interface
export interface Product {
  // ... existing fields
  specialProperties?: SpecialProperties;
}

// New response interface
export interface SpecialProductsResponse {
  newArrivals: Product[];
  productsWithOffers: Product[];
  bestSellers: Product[];
}
```

### 2. Updated ProductService
**File**: `FE/packages/web/src/services/productService.ts`

```typescript
// Get products by special property type
async getProductsBySpecialProperty(propertyType: string, limit: number = 5): Promise<Product[]>

// Get all special products in one call
async getAllSpecialProducts(limitPerType: number = 5): Promise<{ [key: string]: Product[] }>

// Get special products using grouped DTO
async getSpecialProductsGrouped(limitPerType: number = 5): Promise<SpecialProductsResponse>
```

## API Usage Examples

### 1. Get New Arrivals (5 products)
```http
GET /products/special/newArrival?limit=5
```

### 2. Get Products with Offers (10 products)
```http
GET /products/special/hasOffer?limit=10
```

### 3. Get Best Sellers (5 products)
```http
GET /products/special/bestSeller?limit=5
```

### 4. Get All Special Products (5 each type)
```http
GET /products/special?limitPerType=5
```

**Response:**
```json
{
  "newArrivals": [/* 5 products */],
  "productsWithOffers": [/* 5 products */], 
  "bestSellers": [/* 5 products */]
}
```

### 5. Get Grouped Special Products
```http
GET /products/special-grouped?limitPerType=5
```

**Response:**
```json
{
  "newArrivals": [/* array of products */],
  "productsWithOffers": [/* array of products */],
  "bestSellers": [/* array of products */]
}
```

## Frontend Integration

### Using the new service methods:

```typescript
import productService from './services/productService';

// Get all special products for homepage
const specialProducts = await productService.getAllSpecialProducts(5);
console.log('New Arrivals:', specialProducts.newArrivals);
console.log('Products with Offers:', specialProducts.productsWithOffers);
console.log('Best Sellers:', specialProducts.bestSellers);

// Get only new arrivals
const newArrivals = await productService.getProductsBySpecialProperty('newArrival', 10);

// Using the grouped DTO approach
const groupedSpecialProducts = await productService.getSpecialProductsGrouped(5);
```

## Database Schema Update

Products in MongoDB should now include the `specialProperties` field:

```json
{
  "_id": "...",
  "name": "Product Name",
  "price": 99.99,
  "specialProperties": {
    "newArrival": true,
    "hasOffer": false,
    "bestSeller": true
  },
  // ... other fields
}
```

## Category Filter Fix

Additionally, enhanced debugging was added to the `getProductsWithAttributeFilters` method to help troubleshoot the category filtering issue:

```typescript
// Debug logging in productService.ts
console.log('ProductService - API call params:', params);
console.log('ProductService - filters input:', filters);
console.log('ProductService - attributeFilters input:', attributeFilters);
console.log('ProductService - Final URL:', url);
```

This will help identify if the category parameter is being properly passed through the filtering pipeline.

## Next Steps

1. **Database Migration**: Update existing products to include the `specialProperties` field where applicable
2. **Admin Interface**: Create UI for managing special properties when creating/editing products
3. **Frontend Components**: Create components to display special product sections on homepage
4. **Testing**: Add unit tests for the new API endpoints and service methods
5. **Documentation**: Update API documentation with the new endpoints

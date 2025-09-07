# HomePage Integration with Special Products API

## Summary of Changes

This document outlines the changes made to integrate the new Special Products API with the HomePage component to display real product data instead of static content.

## Files Modified

### 1. HomePage.tsx
**Path**: `FE/packages/web/src/pages/HomePage/HomePage.tsx`

**Key Changes:**
- Added imports for `productService`, `Product`, and `SpecialProductsResponse` types
- Added state management for special products data (`specialProducts`, `isLoadingProducts`, `error`)
- Added `useEffect` hook to fetch special products data on component mount
- Updated product sections to use API data instead of static content:
  - **New Arrivals Section**: Now uses `specialProducts.newArrivals`
  - **Bestsellers Section**: Now uses `specialProducts.bestSellers`  
  - **Special Offers Section**: Now uses `specialProducts.productsWithOffers`
- Enhanced `ProductCard` component to handle both API and static data formats
- Added loading states and error handling for each product section
- Added fallback to static content if API fails

### 2. Enhanced ProductCard Component
The `ProductCard` component now includes:
- Support for both API products and static content products (`isApiProduct` prop)
- Dynamic badge display based on special properties (NEW, OFFER, BESTSELLER)
- Out of stock handling
- Product ratings display
- Enhanced hover effects with product links
- Improved error handling with fallback images

### 3. Debug Component (Optional)
**Path**: `FE/packages/web/src/components/SpecialProductsDebug.tsx`

A debug component for testing the special products API endpoints independently.

## API Integration Details

### Data Flow
1. **Component Mount**: `HomePage` component mounts and triggers `useEffect`
2. **API Call**: Calls `productService.getSpecialProductsGrouped(5)` to fetch 5 products of each type
3. **Data Processing**: API response is stored in component state
4. **UI Update**: Product sections are updated with real data
5. **Error Handling**: If API fails, fallback to static content is used

### API Endpoints Used
- `GET /products/special-grouped?limitPerType=5`
- Returns: `SpecialProductsResponse` with arrays for each product type

### Product Types Displayed
1. **New Arrivals** (`specialProperties.newArrival: true`)
2. **Products with Offers** (`specialProperties.hasOffer: true`)
3. **Best Sellers** (`specialProperties.bestSeller: true`)

## Testing Instructions

### 1. Backend Setup
Ensure the backend is running and the special products API endpoints are available:
```bash
# Navigate to backend directory
cd BE/ecommerce-api

# Start the Spring Boot application
./mvnw spring-boot:run
```

### 2. Database Setup
Make sure your MongoDB has products with the `specialProperties` field:
```json
{
  "_id": "...",
  "name": "Sample Product",
  "price": 99.99,
  "specialProperties": {
    "newArrival": true,
    "hasOffer": false,
    "bestSeller": false
  },
  "isActive": true
}
```

### 3. Frontend Testing
```bash
# Navigate to frontend directory
cd FE

# Install dependencies (if not done)
npm install

# Start the development server
npm start
```

### 4. Manual Testing Steps
1. **Open Homepage**: Navigate to `http://localhost:3000`
2. **Check Loading States**: Observe loading spinners while API calls are in progress
3. **Verify Product Sections**: 
   - New Arrivals section should show products with `newArrival: true`
   - Bestsellers section should show products with `bestSeller: true`
   - Special Offers section should show products with `hasOffer: true`
4. **Test Error Handling**: Stop backend and refresh page to see fallback behavior
5. **Check Product Cards**: Verify badges, images, pricing, and stock status
6. **Test Interactions**: Click on product cards to ensure navigation works

### 5. Debug Component Testing (Optional)
Add the debug component to a route for detailed API testing:
```typescript
// In your router configuration
import SpecialProductsDebug from '../components/SpecialProductsDebug';

// Add route
<Route path="/debug/special-products" element={<SpecialProductsDebug />} />
```

Then navigate to `http://localhost:3000/debug/special-products` to test individual API endpoints.

### 6. Console Verification
Check browser console for:
```
Special products loaded: {
  newArrivals: [...],
  productsWithOffers: [...],
  bestSellers: [...]
}
```

## Expected Behavior

### Success Case
- Homepage loads with real product data
- Each section shows relevant products based on special properties
- Products display correct badges, images, and information
- Loading states are brief and smooth

### Error Case
- If API fails, sections fall back to static content
- Error message is logged to console
- User sees products from static content files

### Empty Data Case
- If no products exist for a special property type, section shows empty state
- Loading completes normally
- Other sections with data still display correctly

## Performance Considerations

1. **Single API Call**: Uses grouped endpoint to fetch all special products in one request
2. **Loading States**: Non-blocking loading with visual feedback
3. **Error Resilience**: Graceful degradation to static content
4. **Caching**: Consider adding React Query or similar for API response caching
5. **Image Optimization**: Placeholder images for missing product images

## Future Enhancements

1. **Product Clicking**: Implement product detail navigation
2. **Add to Cart**: Integrate with cart functionality
3. **Infinite Scroll**: Load more products in each section
4. **Filtering**: Allow users to filter within special product categories
5. **Personalization**: Show personalized special products based on user preferences
6. **Analytics**: Track which special product sections perform best

## Troubleshooting

### Common Issues

1. **API Not Found (404)**
   - Check if backend is running
   - Verify API endpoints are properly configured
   - Check CORS settings

2. **Empty Product Arrays**
   - Verify database has products with special properties
   - Check that products have `isActive: true`
   - Ensure special properties are correctly set

3. **Image Loading Issues**
   - Check product image URLs
   - Verify image hosting/storage is accessible
   - Fallback placeholder images should display

4. **TypeScript Errors**
   - Ensure all type definitions are imported correctly
   - Check that API response matches expected interface
   - Verify service method signatures

5. **Performance Issues**
   - Monitor API response times
   - Consider implementing loading optimization
   - Check for unnecessary re-renders

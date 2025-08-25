import api from './api';
import { API_CONFIG, createApiMethod } from '../config/apiConfig';
import { Product, ProductRequest, ProductFilters, PaginatedProductResponse } from '../types';

class ProductService {
  // Create endpoint builders for each product endpoint
  private readonly endpoints = {
    list: createApiMethod.get(API_CONFIG.PRODUCTS.LIST),
    detail: createApiMethod.get(API_CONFIG.PRODUCTS.DETAIL),
    search: createApiMethod.get(API_CONFIG.PRODUCTS.SEARCH),
    category: createApiMethod.get(API_CONFIG.PRODUCTS.CATEGORY),
    priceRange: createApiMethod.get(API_CONFIG.PRODUCTS.PRICE_RANGE),
    create: createApiMethod.post(API_CONFIG.PRODUCTS.CREATE),
    update: createApiMethod.put(API_CONFIG.PRODUCTS.UPDATE),
    delete: createApiMethod.delete(API_CONFIG.PRODUCTS.DELETE),
  };
  // Get all products with pagination and filters (matches new backend endpoint)
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    const url = this.endpoints.list({}, {
      page: filters.page || 0,
      size: filters.size || 20,
      sortBy: filters.sortBy || 'name',
      sortDir: filters.sortDir || 'asc',
      category: filters.category,
      subCategory: filters.subCategory,
      brand: filters.brand,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
    
    const response = await api.get(url);
    
    // Transform the response to ensure backward compatibility
    const transformedData = {
      ...response.data,
      content: response.data.content.map(this.transformProduct)
    };
    
    return transformedData;
  }

  // Transform product data to ensure frontend compatibility
  private transformProduct(product: any): Product {
    return {
      ...product,
      // Add computed properties for backward compatibility
      imageUrl: product.mainImageUrl || (product.images && product.images.length > 0 ? product.images[0] : ''),
      inStock: (product.totalStock || product.stockQuantity || 0) > 0,
      rating: product.averageRating || 0,
      reviewCount: product.totalReviews || 0,
    };
  }

  // Get single product by ID (updated for string ID)
  async getProductById(id: string): Promise<Product> {
    const endpoint = this.endpoints.detail({ id });
    const response = await api.get(endpoint);
    return this.transformProduct(response.data);
  }

  // Search products by query (updated to use new search endpoint)
  async searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    const url = this.endpoints.search({}, { 
      query,
      page: filters.page || 0,
      size: filters.size || 20,
      sortBy: filters.sortBy || 'name',
      sortDir: filters.sortDir || 'asc',
    });
    const response = await api.get(url);
    
    // Transform the response
    const transformedData = {
      ...response.data,
      content: response.data.content.map(this.transformProduct)
    };
    
    return transformedData;
  }

  // Get products by category (updated to return paginated response)
  async getProductsByCategory(category: string, filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    return this.getProducts({ ...filters, category });
  }

  // Get products by brand
  async getProductsByBrand(brand: string, filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    return this.getProducts({ ...filters, brand });
  }

  // Get products by subcategory
  async getProductsBySubCategory(category: string, subCategory: string, filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    return this.getProducts({ ...filters, category, subCategory });
  }

  // Get products by price range (updated to return paginated response)
  async getProductsByPriceRange(minPrice: number, maxPrice: number, filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    return this.getProducts({ ...filters, minPrice, maxPrice });
  }

  // Create new product (admin only)
  async createProduct(product: ProductRequest): Promise<Product> {
    const endpoint = this.endpoints.create();
    const response = await api.post(endpoint, product);
    return response.data;
  }

  // Update existing product (admin only) - updated for string ID
  async updateProduct(id: string, product: ProductRequest): Promise<Product> {
    const endpoint = this.endpoints.update({ id });
    const response = await api.put(endpoint, product);
    return this.transformProduct(response.data);
  }

  // Delete product (admin only) - updated for string ID
  async deleteProduct(id: string): Promise<void> {
    const endpoint = this.endpoints.delete({ id });
    await api.delete(endpoint);
  }

  // New methods for enhanced API functionality
  
  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const endpoint = '/products/categories';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback: extract from products
      return this.extractCategoriesFromProducts();
    }
  }

  // Get brands
  async getBrands(): Promise<string[]> {
    try {
      const endpoint = '/products/brands';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  // Get subcategories by category
  async getSubCategories(category: string): Promise<string[]> {
    try {
      const endpoint = `/products/categories/${category}/subcategories`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    try {
      const endpoint = `/products/featured?limit=${limit}`;
      const response = await api.get(endpoint);
      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Get top-rated products
  async getTopRatedProducts(limit: number = 10, minRating: number = 4.0): Promise<Product[]> {
    try {
      const endpoint = `/products/top-rated?limit=${limit}&minRating=${minRating}`;
      const response = await api.get(endpoint);
      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error('Error fetching top-rated products:', error);
      return [];
    }
  }

  // Fallback method to extract categories from products
  private async extractCategoriesFromProducts(): Promise<string[]> {
    try {
      const productsResponse = await this.getProducts({ page: 0, size: 1000 });
      const categories = Array.from(new Set(
        productsResponse.content
          .map(product => product.category)
          .filter((category): category is string => Boolean(category))
      ));
      return categories;
    } catch (error) {
      console.error('Error extracting categories from products:', error);
      return [];
    }
  }
}

export default new ProductService();

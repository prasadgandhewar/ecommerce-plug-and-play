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
  // Get all products with pagination (matches backend endpoint)
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    const url = this.endpoints.list({}, {
      page: filters.page,
      size: filters.size,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get single product by ID
  async getProductById(id: number): Promise<Product> {
    const endpoint = this.endpoints.detail({ id });
    const response = await api.get(endpoint);
    return response.data;
  }

  // Search products by name
  async searchProducts(name: string): Promise<Product[]> {
    const url = this.endpoints.search({}, { name });
    const response = await api.get(url);
    return response.data;
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const endpoint = this.endpoints.category({ category });
    const response = await api.get(endpoint);
    return response.data;
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const url = this.endpoints.priceRange({}, { minPrice, maxPrice });
    const response = await api.get(url);
    return response.data;
  }

  // Create new product (admin only)
  async createProduct(product: ProductRequest): Promise<Product> {
    const endpoint = this.endpoints.create();
    const response = await api.post(endpoint, product);
    return response.data;
  }

  // Update existing product (admin only)
  async updateProduct(id: number, product: ProductRequest): Promise<Product> {
    const endpoint = this.endpoints.update({ id });
    const response = await api.put(endpoint, product);
    return response.data;
  }

  // Delete product (admin only)
  async deleteProduct(id: number): Promise<void> {
    const endpoint = this.endpoints.delete({ id });
    await api.delete(endpoint);
  }

  // Helper method to get categories from existing products
  async getCategories(): Promise<string[]> {
    try {
      // Since backend doesn't have a dedicated categories endpoint,
      // we'll extract unique categories from products
      const productsResponse = await this.getProducts({ page: 0, size: 1000 });
      const categories = Array.from(new Set(productsResponse.content.map(product => product.category)));
      return categories.filter(Boolean); // Remove empty/null categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

export default new ProductService();

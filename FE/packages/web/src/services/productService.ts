import api from './api';
import { API_CONFIG, buildEndpoint } from '../config/apiConfig';
import { Product, ProductRequest, ProductFilters, PaginatedProductResponse } from '../types';

class ProductService {
  // Get all products with pagination (matches backend endpoint)
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProductResponse> {
    const params = new URLSearchParams();
    
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);
    
    const response = await api.get(`${API_CONFIG.PRODUCTS.LIST}?${params.toString()}`);
    return response.data;
  }

  // Get single product by ID
  async getProductById(id: number): Promise<Product> {
    const endpoint = buildEndpoint(API_CONFIG.PRODUCTS.DETAIL, { id });
    const response = await api.get(endpoint);
    return response.data;
  }

  // Search products by name
  async searchProducts(name: string): Promise<Product[]> {
    const response = await api.get(API_CONFIG.PRODUCTS.SEARCH, {
      params: { name }
    });
    return response.data;
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get(`${API_CONFIG.PRODUCTS.LIST}/category/${category}`);
    return response.data;
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const response = await api.get(`${API_CONFIG.PRODUCTS.LIST}/price-range`, {
      params: { minPrice, maxPrice }
    });
    return response.data;
  }

  // Create new product (admin only)
  async createProduct(product: ProductRequest): Promise<Product> {
    const response = await api.post(API_CONFIG.PRODUCTS.CREATE, product);
    return response.data;
  }

  // Update existing product (admin only)
  async updateProduct(id: number, product: ProductRequest): Promise<Product> {
    const endpoint = buildEndpoint(API_CONFIG.PRODUCTS.UPDATE, { id });
    const response = await api.put(endpoint, product);
    return response.data;
  }

  // Delete product (admin only)
  async deleteProduct(id: number): Promise<void> {
    const endpoint = buildEndpoint(API_CONFIG.PRODUCTS.DELETE, { id });
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

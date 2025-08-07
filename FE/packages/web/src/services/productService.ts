import api from './api';
import { API_CONFIG, buildEndpoint } from '../config/apiConfig';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
}

export interface ProductFilters {
  category?: string;
  page?: number;
  size?: number;
  keyword?: string;
}

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    
    const response = await api.get(`${API_CONFIG.PRODUCTS.LIST}?${params.toString()}`);
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const endpoint = buildEndpoint(API_CONFIG.PRODUCTS.DETAIL, { id });
    const response = await api.get(endpoint);
    return response.data;
  }

  async searchProducts(keyword: string, page: number = 0, size: number = 20): Promise<Product[]> {
    const response = await api.get(API_CONFIG.PRODUCTS.SEARCH, {
      params: { keyword, page, size }
    });
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get(API_CONFIG.PRODUCTS.CATEGORIES);
    return response.data;
  }

  async createProduct(product: ProductRequest): Promise<Product> {
    const response = await api.post(API_CONFIG.PRODUCTS.CREATE, product);
    return response.data;
  }

  async updateProduct(id: number, product: ProductRequest): Promise<Product> {
    const endpoint = buildEndpoint(API_CONFIG.PRODUCTS.UPDATE, { id });
    const response = await api.put(endpoint, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    const endpoint = buildEndpoint(API_CONFIG.PRODUCTS.DELETE, { id });
    await api.delete(endpoint);
  }
}

export default new ProductService();

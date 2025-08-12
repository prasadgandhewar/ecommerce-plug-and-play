import api from './api';
import { API_CONFIG, createApiMethod } from '../config/apiConfig';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    stockQuantity: number;
  };
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  cartItemId: number;
  quantity: number;
}

class CartService {
  // Create endpoint builders for each cart endpoint
  private readonly endpoints = {
    list: createApiMethod.get(API_CONFIG.CART.LIST),
    add: createApiMethod.post(API_CONFIG.CART.ADD),
    update: createApiMethod.put(API_CONFIG.CART.UPDATE),
    remove: createApiMethod.delete(API_CONFIG.CART.REMOVE),
    clear: createApiMethod.delete(API_CONFIG.CART.CLEAR),
    count: createApiMethod.get(API_CONFIG.CART.COUNT),
  };

  async getCart(): Promise<CartResponse> {
    const endpoint = this.endpoints.list();
    const response = await api.get(endpoint);
    return response.data;
  }

  async addToCart(item: AddToCartRequest): Promise<CartResponse> {
    const endpoint = this.endpoints.add();
    const response = await api.post(endpoint, item);
    return response.data;
  }

  async updateCartItem(item: UpdateCartRequest): Promise<CartResponse> {
    const endpoint = this.endpoints.update();
    const response = await api.put(endpoint, item);
    return response.data;
  }

  async removeFromCart(cartItemId: number): Promise<CartResponse> {
    const endpoint = this.endpoints.remove({ id: cartItemId });
    const response = await api.delete(endpoint);
    return response.data;
  }

  async clearCart(): Promise<void> {
    const endpoint = this.endpoints.clear();
    await api.delete(endpoint);
  }

  async getCartCount(): Promise<number> {
    const endpoint = this.endpoints.count();
    const response = await api.get(endpoint);
    return response.data.count;
  }
}

export default new CartService();

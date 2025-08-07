import api from './api';
import { API_CONFIG, buildEndpoint } from '../config/apiConfig';

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
  async getCart(): Promise<CartResponse> {
    const response = await api.get(API_CONFIG.CART.LIST);
    return response.data;
  }

  async addToCart(item: AddToCartRequest): Promise<CartResponse> {
    const response = await api.post(API_CONFIG.CART.ADD, item);
    return response.data;
  }

  async updateCartItem(item: UpdateCartRequest): Promise<CartResponse> {
    const response = await api.put(API_CONFIG.CART.UPDATE, item);
    return response.data;
  }

  async removeFromCart(cartItemId: number): Promise<CartResponse> {
    const endpoint = buildEndpoint(API_CONFIG.CART.REMOVE, { id: cartItemId });
    const response = await api.delete(endpoint);
    return response.data;
  }

  async clearCart(): Promise<void> {
    await api.delete(API_CONFIG.CART.CLEAR);
  }

  async getCartCount(): Promise<number> {
    const response = await api.get(API_CONFIG.CART.COUNT);
    return response.data.count;
  }
}

export default new CartService();

import api from './api';
import { API_CONFIG, buildEndpoint } from '../config/apiConfig';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
}

class OrderService {
  async getOrders(page: number = 0, size: number = 20): Promise<Order[]> {
    const response = await api.get(API_CONFIG.ORDERS.LIST, {
      params: { page, size }
    });
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const endpoint = buildEndpoint(API_CONFIG.ORDERS.DETAIL, { id });
    const response = await api.get(endpoint);
    return response.data;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await api.post(API_CONFIG.ORDERS.CREATE, orderData);
    return response.data;
  }

  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    const endpoint = buildEndpoint(API_CONFIG.ORDERS.UPDATE, { id });
    const response = await api.put(endpoint, orderData);
    return response.data;
  }

  async cancelOrder(id: number): Promise<Order> {
    const endpoint = buildEndpoint(API_CONFIG.ORDERS.CANCEL, { id });
    const response = await api.post(endpoint);
    return response.data;
  }

  async getOrderHistory(page: number = 0, size: number = 20): Promise<Order[]> {
    const response = await api.get(API_CONFIG.ORDERS.HISTORY, {
      params: { page, size }
    });
    return response.data;
  }
}

export default new OrderService();

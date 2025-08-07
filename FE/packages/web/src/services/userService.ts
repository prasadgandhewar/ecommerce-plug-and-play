import api from './api';
import { API_CONFIG, buildEndpoint } from '../config/apiConfig';
import { User } from './authService';

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AddAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends AddAddressRequest {
  id: number;
}

class UserService {
  async getProfile(): Promise<User> {
    const response = await api.get(API_CONFIG.USERS.PROFILE);
    return response.data;
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    const response = await api.put(API_CONFIG.USERS.UPDATE, profileData);
    return response.data;
  }

  async getAddresses(): Promise<Address[]> {
    const response = await api.get(API_CONFIG.USERS.ADDRESSES);
    return response.data;
  }

  async addAddress(addressData: AddAddressRequest): Promise<Address> {
    const response = await api.post(API_CONFIG.USERS.ADD_ADDRESS, addressData);
    return response.data;
  }

  async updateAddress(addressData: UpdateAddressRequest): Promise<Address> {
    const endpoint = buildEndpoint(API_CONFIG.USERS.UPDATE_ADDRESS, { id: addressData.id });
    const response = await api.put(endpoint, addressData);
    return response.data;
  }

  async deleteAddress(id: number): Promise<void> {
    const endpoint = buildEndpoint(API_CONFIG.USERS.DELETE_ADDRESS, { id });
    await api.delete(endpoint);
  }
}

export default new UserService();

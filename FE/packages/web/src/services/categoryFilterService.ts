import api from './api';
import { CategoryFilter } from '../types';

class CategoryFilterService {
  private readonly baseUrl = '/categories';

  // Get all categories with their filters
  async getAllCategories(): Promise<CategoryFilter[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching category filters:', error);
      throw error;
    }
  }

  // Get filters for a specific category
  async getCategoryFilters(category: string): Promise<CategoryFilter> {
    try {
      const response = await api.get(`${this.baseUrl}/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching filters for category ${category}:`, error);
      throw error;
    }
  }

  // Get all category names
  async getCategoryNames(): Promise<string[]> {
    try {
      const categories = await this.getAllCategories();
      return categories.map(cat => cat.category);
    } catch (error) {
      console.error('Error fetching category names:', error);
      throw error;
    }
  }

  // Create a new category (admin only)
  async createCategory(categoryFilter: CategoryFilter): Promise<CategoryFilter> {
    try {
      const response = await api.post(this.baseUrl, categoryFilter);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update a category (admin only)
  async updateCategory(id: string, categoryFilter: CategoryFilter): Promise<CategoryFilter> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, categoryFilter);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete a category (admin only)
  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export default new CategoryFilterService();

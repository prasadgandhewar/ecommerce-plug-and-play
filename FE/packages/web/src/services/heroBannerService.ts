import { API_CONFIG, getCurrentEnvConfig } from '../config/apiConfig';

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  price: string;
  buttonText: string;
  image: string;
  bgColor: string;
  isActive: boolean;
  sortOrder: number;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

class HeroBannerService {
  private baseUrl = `${getCurrentEnvConfig().API_BASE_URL}/hero-banners`;

  /**
   * Get all active hero banners for a specific locale
   */
  async getActiveHeroBanners(locale: string = 'en'): Promise<HeroBanner[]> {
    try {
      const response = await fetch(`${this.baseUrl}?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching hero banners:', error);
      throw error;
    }
  }

  /**
   * Get all active hero banners regardless of locale
   */
  async getAllActiveHeroBanners(): Promise<HeroBanner[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all hero banners:', error);
      throw error;
    }
  }

  /**
   * Get a specific hero banner by ID
   */
  async getHeroBannerById(id: string): Promise<HeroBanner> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching hero banner ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get hero banners by locale (including inactive)
   */
  async getHeroBannersByLocale(locale: string): Promise<HeroBanner[]> {
    try {
      const response = await fetch(`${this.baseUrl}/locale/${locale}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching hero banners for locale ${locale}:`, error);
      throw error;
    }
  }
}

const heroBannerService = new HeroBannerService();
export default heroBannerService;

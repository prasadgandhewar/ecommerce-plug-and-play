export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    brand: Record<string, string>;
    primary: Record<string, string>;
    accent: Record<string, string>;
    neutral: Record<string, string>;
    sage?: Record<string, string>;
  };
  fonts: {
    heading: string;
    body: string;
  };
  branding: {
    logoIcon: string;
    companyName: string;
    tagline: string;
    industry: string;
  };
  content: {
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    categories: Array<{
      name: string;
      image: string;
      count: string;
    }>;
    features: Array<{
      title: string;
      description: string;
    }>;
    footer?: {
      description: string;
      quickLinks: {
        blog: string;
      };
      newsletter: {
        title: string;
        description: string;
      };
      contact: {
        address: string;
        phone: string;
        email: string;
      };
      copyright: string;
    };
  };
}

// Plant/Nature Theme (Current Urban Jungle Co.)
export const plantTheme: ThemeConfig = {
  id: 'plant',
  name: 'Urban Jungle',
  description: 'Nature-inspired plant ecommerce theme',
  colors: {
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    accent: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    sage: {
      50: '#f6f7f6',
      100: '#e3e7e3',
      200: '#c7d0c7',
      300: '#a3b5a3',
      400: '#7d977d',
      500: '#5f7b5f',
      600: '#4a634a',
      700: '#3d523d',
      800: '#344434',
      900: '#2d3a2d',
    }
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  branding: {
    logoIcon: 'FaLeaf',
    companyName: 'Urban Jungle Co.',
    tagline: 'Premium Plants',
    industry: 'plants',
  },
  content: {
    heroTitle: 'Transform Your Space with Premium Plants',
    heroSubtitle: 'Discover our curated collection of beautiful, healthy plants that bring life and tranquility to your home or office.',
    searchPlaceholder: 'Search for plants...',
    categories: [
      {
        name: 'Houseplants',
        image: 'https://images.unsplash.com/photo-1586093248969-3d8ea0c76a99?w=300&h=300&fit=crop',
        count: '120+ items',
      },
      {
        name: 'Outdoor Plants',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
        count: '89+ items',
      },
      {
        name: 'Succulents',
        image: 'https://images.unsplash.com/photo-1509423350716-97f2360af622?w=300&h=300&fit=crop',
        count: '156+ items',
      },
      {
        name: 'Air Purifying',
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&h=300&fit=crop',
        count: '67+ items',
      },
    ],
    features: [
      {
        title: 'Free Delivery',
        description: 'Free shipping on orders over $50',
      },
      {
        title: 'Plant Care Guide',
        description: 'Expert care instructions included',
      },
      {
        title: 'Healthy Guarantee',
        description: '30-day plant health guarantee',
      },
      {
        title: 'Expert Support',
        description: '24/7 plant care support',
      },
    ],
    footer: {
      description: 'Transform your living space with our curated collection of premium plants. We believe in the transformative power of nature to create beautiful, healthy living environments.',
      quickLinks: {
        blog: 'Plant Care Tips',
      },
      newsletter: {
        title: 'Stay Connected',
        description: 'Subscribe to get special offers, plant care tips, and exclusive deals.',
      },
      contact: {
        address: '123 Garden Street, Plant City, PC 12345',
        phone: '+1 (555) 123-PLANT',
        email: 'hello@urbanjungleco.com',
      },
      copyright: 'Urban Jungle Co.',
    },
  },
};

// Tech/Modern Theme (New Blue Tech Theme)
export const techTheme: ThemeConfig = {
  id: 'tech',
  name: 'TechFlow',
  description: 'Modern technology and electronics theme',
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  fonts: {
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  branding: {
    logoIcon: 'FaMicrochip',
    companyName: 'TechFlow Store',
    tagline: 'Next-Gen Tech',
    industry: 'technology',
  },
  content: {
    heroTitle: 'Discover Cutting-Edge Technology',
    heroSubtitle: 'Explore our premium collection of the latest gadgets, electronics, and innovative tech solutions for modern life.',
    searchPlaceholder: 'Search for tech products...',
    categories: [
      {
        name: 'Smartphones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
        count: '150+ items',
      },
      {
        name: 'Laptops',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        count: '89+ items',
      },
      {
        name: 'Audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        count: '200+ items',
      },
      {
        name: 'Gaming',
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=300&fit=crop',
        count: '120+ items',
      },
    ],
    features: [
      {
        title: 'Fast Shipping',
        description: 'Same-day delivery available',
      },
      {
        title: 'Tech Support',
        description: '24/7 technical assistance',
      },
      {
        title: 'Warranty',
        description: 'Extended warranty options',
      },
      {
        title: 'Trade-In',
        description: 'Device trade-in program',
      },
    ],
    footer: {
      description: 'Discover the future of technology with our cutting-edge products. From smartphones to smart home devices, we bring you the latest innovations to enhance your digital lifestyle.',
      quickLinks: {
        blog: 'Tech News & Reviews',
      },
      newsletter: {
        title: 'Tech Updates',
        description: 'Get the latest product launches, tech news, and exclusive deals delivered to your inbox.',
      },
      contact: {
        address: '456 Innovation Drive, Tech Valley, TV 67890',
        phone: '+1 (555) 456-TECH',
        email: 'support@techflowstore.com',
      },
      copyright: 'TechFlow Store',
    },
  },
};

// Theme registry
export const themes: Record<string, ThemeConfig> = {
  plant: plantTheme,
  tech: techTheme,
};

// Default theme
export const defaultTheme = plantTheme;

// Get theme by ID
export const getTheme = (themeId: string): ThemeConfig => {
  return themes[themeId] || defaultTheme;
};

// Get all available themes
export const getAllThemes = (): ThemeConfig[] => {
  return Object.values(themes);
};

package com.ecommerce.api.config;

import com.ecommerce.api.entity.Product;
import com.ecommerce.api.entity.ProductVariation;
import com.ecommerce.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class ProductDataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no products exist
        if (productRepository.count() == 0) {
            initializeSampleProducts();
        }
    }

    private void initializeSampleProducts() {
        List<Product> products = new ArrayList<>();

        // Mobile Products
        products.add(createMobileProduct("MOB-SAM-001", "Samsung Galaxy S23 Ultra", "Samsung", 
                "12GB", "256GB", "5000mAh", 1199.99));
        products.add(createMobileProduct("MOB-APP-001", "iPhone 15 Pro", "Apple", 
                "8GB", "256GB", "3279mAh", 1099.99));
        products.add(createMobileProduct("MOB-XIA-001", "Xiaomi Mi 13 Pro", "Xiaomi", 
                "12GB", "256GB", "4600mAh", 799.99));

        // Laptop Products
        products.add(createLaptopProduct("LAP-DEL-001", "Dell XPS 13", "Dell", 
                "16GB", "512GB SSD", "Intel i7", 1299.99));
        products.add(createLaptopProduct("LAP-APP-001", "MacBook Pro 14", "Apple", 
                "16GB", "512GB SSD", "Apple M2", 1999.99));
        products.add(createLaptopProduct("LAP-HP-001", "HP Spectre x360", "HP", 
                "16GB", "1TB SSD", "Intel i7", 1499.99));

        // Fashion Products
        products.add(createFashionProduct("FAS-NIK-001", "Nike Air Max 270", "Nike", 
                "M", "Black", "Canvas", 129.99));
        products.add(createFashionProduct("FAS-ADI-001", "Adidas Ultraboost 22", "Adidas", 
                "L", "White", "Polyester", 189.99));

        // Home Appliances
        products.add(createHomeApplianceProduct("HOME-SAM-001", "Samsung 55\" 4K TV", "Samsung", 
                "TV", "55 inch", "4 Star", 699.99));
        products.add(createHomeApplianceProduct("HOME-LG-001", "LG Front Load Washing Machine", "LG", 
                "Washing Machine", "7kg", "5 Star", 599.99));

        productRepository.saveAll(products);
        System.out.println("Sample products initialized with attributes support");
    }

    private Product createMobileProduct(String sku, String name, String brand, String ram, String storage, String battery, double price) {
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription("Premium smartphone with advanced features");
        product.setCategory("Mobile");
        product.setSubCategory("Smartphones");
        product.setBrand(brand);
        product.setPrice(BigDecimal.valueOf(price));
        product.setCurrency("USD");
        product.setStockQuantity(50);
        product.setIsActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Set images
        List<String> images = Arrays.asList(
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
        );
        product.setImages(images);

        // Set attributes for filtering
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("ram", ram);
        attributes.put("storage", storage);
        attributes.put("battery", battery);
        attributes.put("brand", brand);
        product.setAttributes(attributes);

        // Add variations
        List<ProductVariation> variations = new ArrayList<>();
        variations.add(createVariation(sku + "-BLK", "Black", price, 20));
        variations.add(createVariation(sku + "-WHT", "White", price, 15));
        variations.add(createVariation(sku + "-BLU", "Blue", price, 15));
        product.setVariations(variations);

        return product;
    }

    private Product createLaptopProduct(String sku, String name, String brand, String ram, String storage, String processor, double price) {
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription("High-performance laptop for work and entertainment");
        product.setCategory("Laptop");
        product.setSubCategory("Ultrabooks");
        product.setBrand(brand);
        product.setPrice(BigDecimal.valueOf(price));
        product.setCurrency("USD");
        product.setStockQuantity(25);
        product.setIsActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Set images
        List<String> images = Arrays.asList(
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
                "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"
        );
        product.setImages(images);

        // Set attributes for filtering
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("ram", ram);
        attributes.put("storage", storage);
        attributes.put("processor", processor);
        attributes.put("brand", brand);
        product.setAttributes(attributes);

        return product;
    }

    private Product createFashionProduct(String sku, String name, String brand, String size, String color, String material, double price) {
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription("Stylish and comfortable fashion item");
        product.setCategory("Fashion");
        product.setSubCategory("Footwear");
        product.setBrand(brand);
        product.setPrice(BigDecimal.valueOf(price));
        product.setCurrency("USD");
        product.setStockQuantity(100);
        product.setIsActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Set images
        List<String> images = Arrays.asList(
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600"
        );
        product.setImages(images);

        // Set attributes for filtering
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("size", size);
        attributes.put("color", color);
        attributes.put("material", material);
        attributes.put("brand", brand);
        product.setAttributes(attributes);

        return product;
    }

    private Product createHomeApplianceProduct(String sku, String name, String brand, String type, String capacity, String energyRating, double price) {
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription("High-quality home appliance with energy efficiency");
        product.setCategory("Home Appliances");
        product.setSubCategory(type);
        product.setBrand(brand);
        product.setPrice(BigDecimal.valueOf(price));
        product.setCurrency("USD");
        product.setStockQuantity(30);
        product.setIsActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Set images
        List<String> images = Arrays.asList(
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600",
                "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600"
        );
        product.setImages(images);

        // Set attributes for filtering
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("type", type);
        attributes.put("capacity", capacity);
        attributes.put("energyRating", energyRating);
        attributes.put("brand", brand);
        product.setAttributes(attributes);

        return product;
    }

    private ProductVariation createVariation(String sku, String color, double price, int stock) {
        ProductVariation variation = new ProductVariation();
        variation.setSku(sku);
        variation.setColor(color);
        variation.setPrice(BigDecimal.valueOf(price));
        variation.setStockQuantity(stock);
        variation.setIsActive(true);
        return variation;
    }
}

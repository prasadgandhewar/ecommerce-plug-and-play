package com.ecommerce.api.service;

import com.ecommerce.api.entity.CategoryFilter;
import com.ecommerce.api.entity.FilterOption;
import com.ecommerce.api.repository.CategoryFilterRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryDataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryFilterRepository categoryFilterRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no categories exist
        if (categoryFilterRepository.count() == 0) {
            initializeCategoriesFromJson();
        }
    }

    private void initializeCategoriesFromJson() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("categories.json");
            InputStream inputStream = resource.getInputStream();
            
            JsonNode categoriesArray = objectMapper.readTree(inputStream);
            
            for (JsonNode categoryNode : categoriesArray) {
                CategoryFilter categoryFilter = new CategoryFilter();
                categoryFilter.setCategory(categoryNode.get("category").asText());
                
                List<FilterOption> filters = new ArrayList<>();
                JsonNode filtersArray = categoryNode.get("filters");
                
                for (JsonNode filterNode : filtersArray) {
                    FilterOption filterOption = new FilterOption();
                    filterOption.setName(filterNode.get("name").asText());
                    filterOption.setType(filterNode.get("type").asText());
                    
                    if (filterNode.has("options")) {
                        List<String> options = new ArrayList<>();
                        for (JsonNode optionNode : filterNode.get("options")) {
                            options.add(optionNode.asText());
                        }
                        filterOption.setOptions(options);
                    }
                    
                    filters.add(filterOption);
                }
                
                categoryFilter.setFilters(filters);
                categoryFilterRepository.save(categoryFilter);
            }
            
            System.out.println("Categories initialized from JSON file");
            
        } catch (Exception e) {
            System.err.println("Error initializing categories: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

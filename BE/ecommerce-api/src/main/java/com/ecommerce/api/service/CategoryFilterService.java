package com.ecommerce.api.service;

import com.ecommerce.api.dto.CategoryFilterDto;
import com.ecommerce.api.dto.FilterOptionDto;
import com.ecommerce.api.entity.CategoryFilter;
import com.ecommerce.api.entity.FilterOption;
import com.ecommerce.api.repository.CategoryFilterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryFilterService {

    @Autowired
    private CategoryFilterRepository categoryFilterRepository;

    // Get all categories
    public List<CategoryFilterDto> getAllCategories() {
        List<CategoryFilter> categories = categoryFilterRepository.findAll();
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get category by name
    public Optional<CategoryFilterDto> getCategoryByName(String category) {
        Optional<CategoryFilter> categoryFilter = categoryFilterRepository.findByCategory(category);
        return categoryFilter.map(this::convertToDto);
    }

    // Create new category
    public CategoryFilterDto createCategory(CategoryFilterDto categoryFilterDto) {
        if (categoryFilterRepository.existsByCategory(categoryFilterDto.getCategory())) {
            throw new RuntimeException("Category already exists: " + categoryFilterDto.getCategory());
        }

        CategoryFilter categoryFilter = convertToEntity(categoryFilterDto);
        CategoryFilter savedCategory = categoryFilterRepository.save(categoryFilter);
        return convertToDto(savedCategory);
    }

    // Update category
    public CategoryFilterDto updateCategory(String id, CategoryFilterDto categoryFilterDto) {
        Optional<CategoryFilter> existingCategory = categoryFilterRepository.findById(id);
        
        if (existingCategory.isEmpty()) {
            throw new RuntimeException("Category not found with id: " + id);
        }

        // Check if category name is being changed and if new name already exists
        CategoryFilter existing = existingCategory.get();
        if (!existing.getCategory().equals(categoryFilterDto.getCategory()) &&
            categoryFilterRepository.existsByCategory(categoryFilterDto.getCategory())) {
            throw new RuntimeException("Category already exists: " + categoryFilterDto.getCategory());
        }

        CategoryFilter categoryFilter = convertToEntity(categoryFilterDto);
        categoryFilter.setId(id);
        CategoryFilter savedCategory = categoryFilterRepository.save(categoryFilter);
        return convertToDto(savedCategory);
    }

    // Delete category
    public void deleteCategory(String id) {
        if (!categoryFilterRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryFilterRepository.deleteById(id);
    }

    // Delete category by name
    public void deleteCategoryByName(String category) {
        if (!categoryFilterRepository.existsByCategory(category)) {
            throw new RuntimeException("Category not found: " + category);
        }
        categoryFilterRepository.deleteByCategory(category);
    }

    // Get all category names only
    public List<String> getAllCategoryNames() {
        List<CategoryFilter> categories = categoryFilterRepository.findAll();
        return categories.stream()
                .map(CategoryFilter::getCategory)
                .collect(Collectors.toList());
    }

    // Check if category exists
    public boolean categoryExists(String category) {
        return categoryFilterRepository.existsByCategory(category);
    }

    // Get categories count
    public long getCategoriesCount() {
        return categoryFilterRepository.count();
    }

    // Convert entity to DTO
    private CategoryFilterDto convertToDto(CategoryFilter categoryFilter) {
        CategoryFilterDto dto = new CategoryFilterDto();
        dto.setId(categoryFilter.getId());
        dto.setCategory(categoryFilter.getCategory());
        
        List<FilterOptionDto> filterDtos = categoryFilter.getFilters().stream()
                .map(this::convertFilterToDto)
                .collect(Collectors.toList());
        dto.setFilters(filterDtos);
        
        return dto;
    }

    // Convert DTO to entity
    private CategoryFilter convertToEntity(CategoryFilterDto categoryFilterDto) {
        CategoryFilter categoryFilter = new CategoryFilter();
        categoryFilter.setId(categoryFilterDto.getId());
        categoryFilter.setCategory(categoryFilterDto.getCategory());
        
        List<FilterOption> filters = categoryFilterDto.getFilters().stream()
                .map(this::convertFilterToEntity)
                .collect(Collectors.toList());
        categoryFilter.setFilters(filters);
        
        return categoryFilter;
    }

    // Convert FilterOption entity to DTO
    private FilterOptionDto convertFilterToDto(FilterOption filterOption) {
        FilterOptionDto dto = new FilterOptionDto();
        dto.setName(filterOption.getName());
        dto.setType(filterOption.getType());
        dto.setOptions(filterOption.getOptions());
        return dto;
    }

    // Convert FilterOptionDto to entity
    private FilterOption convertFilterToEntity(FilterOptionDto filterOptionDto) {
        FilterOption filterOption = new FilterOption();
        filterOption.setName(filterOptionDto.getName());
        filterOption.setType(filterOptionDto.getType());
        filterOption.setOptions(filterOptionDto.getOptions());
        return filterOption;
    }
}

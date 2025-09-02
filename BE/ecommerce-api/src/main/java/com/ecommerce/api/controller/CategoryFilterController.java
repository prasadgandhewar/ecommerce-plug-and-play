package com.ecommerce.api.controller;

import com.ecommerce.api.dto.CategoryFilterDto;
import com.ecommerce.api.service.CategoryFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CategoryFilterController {

    @Autowired
    private CategoryFilterService categoryFilterService;

    /**
     * Get all categories with their filters
     */
    @GetMapping
    public ResponseEntity<List<CategoryFilterDto>> getAllCategories() {
        try {
            List<CategoryFilterDto> categories = categoryFilterService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all category names only
     */
    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllCategoryNames() {
        try {
            List<String> categoryNames = categoryFilterService.getAllCategoryNames();
            return ResponseEntity.ok(categoryNames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get category filters by category name
     */
    @GetMapping("/{category}")
    public ResponseEntity<CategoryFilterDto> getCategoryByName(@PathVariable String category) {
        try {
            Optional<CategoryFilterDto> categoryFilter = categoryFilterService.getCategoryByName(category);
            return categoryFilter.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new category with filters
     */
    @PostMapping
    public ResponseEntity<CategoryFilterDto> createCategory(@Valid @RequestBody CategoryFilterDto categoryFilterDto) {
        try {
            CategoryFilterDto createdCategory = categoryFilterService.createCategory(categoryFilterDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Category already exists
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing category
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryFilterDto> updateCategory(
            @PathVariable String id, 
            @Valid @RequestBody CategoryFilterDto categoryFilterDto) {
        try {
            CategoryFilterDto updatedCategory = categoryFilterService.updateCategory(id, categoryFilterDto);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a category by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        try {
            categoryFilterService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a category by category name
     */
    @DeleteMapping("/by-name/{category}")
    public ResponseEntity<Void> deleteCategoryByName(@PathVariable String category) {
        try {
            categoryFilterService.deleteCategoryByName(category);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if a category exists
     */
    @GetMapping("/exists/{category}")
    public ResponseEntity<Boolean> categoryExists(@PathVariable String category) {
        try {
            boolean exists = categoryFilterService.categoryExists(category);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get categories count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getCategoriesCount() {
        try {
            long count = categoryFilterService.getCategoriesCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

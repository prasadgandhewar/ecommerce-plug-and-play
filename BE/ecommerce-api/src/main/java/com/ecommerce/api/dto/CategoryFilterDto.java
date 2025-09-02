package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.Valid;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryFilterDto {
    
    private String id;
    
    @NotBlank(message = "Category name is required")
    private String category;
    
    @NotEmpty(message = "At least one filter is required")
    @Valid
    private List<FilterOptionDto> filters;
}

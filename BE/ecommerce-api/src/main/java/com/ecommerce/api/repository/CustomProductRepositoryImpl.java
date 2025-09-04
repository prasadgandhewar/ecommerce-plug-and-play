package com.ecommerce.api.repository;

import com.ecommerce.api.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Repository
public class CustomProductRepositoryImpl implements CustomProductRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Page<Product> findByAttributeFilters(String category, Map<String, Object> attributeFilters, Pageable pageable) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // Add active filter (isActive is true or doesn't exist)
        Criteria activeCriteria = new Criteria().orOperator(
                Criteria.where("isActive").is(true),
                Criteria.where("isActive").exists(false),
                Criteria.where("isActive").is(null)
        );
        criteriaList.add(activeCriteria);

        // Add category filter if provided
        if (category != null && !category.trim().isEmpty()) {
            criteriaList.add(Criteria.where("category").regex(Pattern.compile("^" + Pattern.quote(category) + "$", Pattern.CASE_INSENSITIVE)));
        }

        // Process attribute filters
        if (attributeFilters != null && !attributeFilters.isEmpty()) {
            for (Map.Entry<String, Object> entry : attributeFilters.entrySet()) {
                String attributeName = entry.getKey();
                Object attributeValue = entry.getValue();

                if (attributeValue == null) {
                    continue;
                }

                // Handle different attribute types
                if (attributeName.equals("price")) {
                    handlePriceFilter(criteriaList, attributeFilters);
                } else if (attributeName.endsWith("_min") || attributeName.endsWith("_max")) {
                    handleRangeFilter(criteriaList, attributeName, attributeValue);
                } else {
                    // Handle string attributes (exact match, case-insensitive)
                    if (attributeValue instanceof String) {
                        String stringValue = (String) attributeValue;
                        if (!stringValue.trim().isEmpty()) {
                            // Try both direct field and attributes field
                            Criteria directFieldCriteria = Criteria.where(attributeName)
                                    .regex(Pattern.compile("^" + Pattern.quote(stringValue) + "$", Pattern.CASE_INSENSITIVE));
                            Criteria attributeFieldCriteria = Criteria.where("attributes." + attributeName)
                                    .regex(Pattern.compile("^" + Pattern.quote(stringValue) + "$", Pattern.CASE_INSENSITIVE));
                            
                            criteriaList.add(new Criteria().orOperator(directFieldCriteria, attributeFieldCriteria));
                        }
                    } else if (attributeValue instanceof List) {
                        @SuppressWarnings("unchecked")
                        List<String> stringValues = (List<String>) attributeValue;
                        if (!stringValues.isEmpty()) {
                            List<Criteria> orCriteriaList = new ArrayList<>();
                            for (String value : stringValues) {
                                if (value != null && !value.trim().isEmpty()) {
                                    // Try both direct field and attributes field
                                    Criteria directFieldCriteria = Criteria.where(attributeName)
                                            .regex(Pattern.compile("^" + Pattern.quote(value) + "$", Pattern.CASE_INSENSITIVE));
                                    Criteria attributeFieldCriteria = Criteria.where("attributes." + attributeName)
                                            .regex(Pattern.compile("^" + Pattern.quote(value) + "$", Pattern.CASE_INSENSITIVE));
                                    
                                    orCriteriaList.add(new Criteria().orOperator(directFieldCriteria, attributeFieldCriteria));
                                }
                            }
                            if (!orCriteriaList.isEmpty()) {
                                criteriaList.add(new Criteria().orOperator(orCriteriaList.toArray(new Criteria[0])));
                            }
                        }
                    }
                }
            }
        }

        // Combine all criteria
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // Apply pagination
        query.with(pageable);

        // Execute query
        List<Product> products = mongoTemplate.find(query, Product.class);
        
        // Get total count for pagination
        Query countQuery = new Query();
        if (!criteriaList.isEmpty()) {
            countQuery.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }
        long total = mongoTemplate.count(countQuery, Product.class);

        return new PageImpl<>(products, pageable, total);
    }

    private void handlePriceFilter(List<Criteria> criteriaList, Map<String, Object> attributeFilters) {
        Object minPriceObj = attributeFilters.get("minPrice");
        Object maxPriceObj = attributeFilters.get("maxPrice");

        if (minPriceObj != null || maxPriceObj != null) {
            Criteria priceCriteria = Criteria.where("price");
            
            if (minPriceObj != null) {
                BigDecimal minPrice = convertToBigDecimal(minPriceObj);
                if (minPrice != null) {
                    priceCriteria = priceCriteria.gte(minPrice);
                }
            }
            
            if (maxPriceObj != null) {
                BigDecimal maxPrice = convertToBigDecimal(maxPriceObj);
                if (maxPrice != null) {
                    priceCriteria = priceCriteria.lte(maxPrice);
                }
            }
            
            criteriaList.add(priceCriteria);
        }
    }

    private void handleRangeFilter(List<Criteria> criteriaList, String attributeName, Object attributeValue) {
        String fieldName;
        boolean isMin = attributeName.endsWith("_min");
        
        if (isMin) {
            fieldName = attributeName.substring(0, attributeName.length() - 4);
        } else {
            fieldName = attributeName.substring(0, attributeName.length() - 4);
        }

        if (attributeValue instanceof Number) {
            Number numValue = (Number) attributeValue;
            
            // Try both direct field and attributes field
            Criteria directFieldCriteria = isMin ? 
                    Criteria.where(fieldName).gte(numValue) : 
                    Criteria.where(fieldName).lte(numValue);
            Criteria attributeFieldCriteria = isMin ? 
                    Criteria.where("attributes." + fieldName).gte(numValue) : 
                    Criteria.where("attributes." + fieldName).lte(numValue);
            
            criteriaList.add(new Criteria().orOperator(directFieldCriteria, attributeFieldCriteria));
        } else if (attributeValue instanceof String) {
            try {
                Double numValue = Double.parseDouble((String) attributeValue);
                
                // Try both direct field and attributes field
                Criteria directFieldCriteria = isMin ? 
                        Criteria.where(fieldName).gte(numValue) : 
                        Criteria.where(fieldName).lte(numValue);
                Criteria attributeFieldCriteria = isMin ? 
                        Criteria.where("attributes." + fieldName).gte(numValue) : 
                        Criteria.where("attributes." + fieldName).lte(numValue);
                
                criteriaList.add(new Criteria().orOperator(directFieldCriteria, attributeFieldCriteria));
            } catch (NumberFormatException e) {
                // Ignore invalid number format
            }
        }
    }

    private BigDecimal convertToBigDecimal(Object value) {
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        } else if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        } else if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}

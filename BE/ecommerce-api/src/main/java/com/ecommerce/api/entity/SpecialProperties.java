package com.ecommerce.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Special properties for products to mark them as new arrivals, having offers, or best sellers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialProperties {

    @Field("newArrival")
    private Boolean newArrival = false;

    @Field("hasOffer")
    private Boolean hasOffer = false;

    @Field("bestSeller")
    private Boolean bestSeller = false;

    // Constructor for convenience
    public SpecialProperties(boolean newArrival, boolean hasOffer, boolean bestSeller) {
        this.newArrival = newArrival;
        this.hasOffer = hasOffer;
        this.bestSeller = bestSeller;
    }

    // Helper methods
    public boolean isNewArrival() {
        return newArrival != null && newArrival;
    }

    public boolean hasOffer() {
        return hasOffer != null && hasOffer;
    }

    public boolean isBestSeller() {
        return bestSeller != null && bestSeller;
    }

    // Check if any special property is set
    public boolean hasAnySpecialProperty() {
        return isNewArrival() || hasOffer() || isBestSeller();
    }
}

# MongoDB Collections Import Guide

This directory contains JSON files for importing homepage data into MongoDB collections.

## Collections

### 1. Hero Sliders Collection (`hero-sliders.json`)
Contains the main carousel/slider data for the homepage hero section.

**Collection Name:** `heroSliders`

**Schema:**
- `_id`: ObjectId (MongoDB unique identifier)
- `title`: String (main heading text)
- `subtitle`: String (secondary heading text)
- `description`: String (descriptive text)
- `discount`: String (discount offer text)
- `price`: String (price display text)
- `buttonText`: String (CTA button text)
- `image`: String (image URL)
- `bgColor`: String (background color class/value)
- `isActive`: Boolean (whether slide is active)
- `sortOrder`: Number (display order)
- `locale`: String (language/locale)
- `createdAt`: Date
- `updatedAt`: Date

### 2. Service Features Collection (`service-features.json`)
Contains the service feature items displayed on the homepage.

**Collection Name:** `serviceFeatures`

**Schema:**
- `_id`: ObjectId (MongoDB unique identifier)
- `title`: String (feature title)
- `description`: String (feature description)
- `icon`: String (emoji or icon identifier)
- `iconType`: String (type of icon: "emoji", "fontawesome", etc.)
- `isActive`: Boolean (whether feature is active)
- `sortOrder`: Number (display order)
- `locale`: String (language/locale)
- `createdAt`: Date
- `updatedAt`: Date

## Import Commands

### Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Create/select your database (e.g., `ecommerce`)
4. For each collection:
   - Click "Import Data"
   - Select the corresponding JSON file
   - Choose "JSON" as file type
   - Click "Import"

### Using MongoDB CLI (mongoimport)

```bash
# Import Hero Sliders
mongoimport --db ecommerce --collection heroSliders --file hero-sliders.json --jsonArray

# Import Service Features
mongoimport --db ecommerce --collection serviceFeatures --file service-features.json --jsonArray
```

### Using MongoDB Atlas
1. Go to your Atlas cluster
2. Click "Browse Collections"
3. Click "Add My Own Data" or use existing database
4. Click "Insert Document"
5. Switch to JSON view and paste the content from each file

## Backend Integration

### Example Spring Boot Entity Classes

#### HeroSlider Entity
```java
@Document(collection = "heroSliders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeroSlider {
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("subtitle")
    private String subtitle;
    
    @Field("description")
    private String description;
    
    @Field("discount")
    private String discount;
    
    @Field("price")
    private String price;
    
    @Field("buttonText")
    private String buttonText;
    
    @Field("image")
    private String image;
    
    @Field("bgColor")
    private String bgColor;
    
    @Field("isActive")
    private Boolean isActive = true;
    
    @Field("sortOrder")
    private Integer sortOrder;
    
    @Field("locale")
    private String locale = "en";
    
    @Field("createdAt")
    private LocalDateTime createdAt;
    
    @Field("updatedAt")
    private LocalDateTime updatedAt;
}
```

#### ServiceFeature Entity
```java
@Document(collection = "serviceFeatures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceFeature {
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("description")
    private String description;
    
    @Field("icon")
    private String icon;
    
    @Field("iconType")
    private String iconType = "emoji";
    
    @Field("isActive")
    private Boolean isActive = true;
    
    @Field("sortOrder")
    private Integer sortOrder;
    
    @Field("locale")
    private String locale = "en";
    
    @Field("createdAt")
    private LocalDateTime createdAt;
    
    @Field("updatedAt")
    private LocalDateTime updatedAt;
}
```

### Repository Examples

```java
@Repository
public interface HeroSliderRepository extends MongoRepository<HeroSlider, String> {
    List<HeroSlider> findByIsActiveTrueAndLocaleOrderBySortOrder(String locale);
    List<HeroSlider> findByIsActiveTrueOrderBySortOrder();
}

@Repository
public interface ServiceFeatureRepository extends MongoRepository<ServiceFeature, String> {
    List<ServiceFeature> findByIsActiveTrueAndLocaleOrderBySortOrder(String locale);
    List<ServiceFeature> findByIsActiveTrueOrderBySortOrder();
}
```

### Controller Examples

```java
@RestController
@RequestMapping("/api/homepage")
public class HomepageController {
    
    @Autowired
    private HeroSliderRepository heroSliderRepository;
    
    @Autowired
    private ServiceFeatureRepository serviceFeatureRepository;
    
    @GetMapping("/hero-sliders")
    public ResponseEntity<List<HeroSlider>> getHeroSliders(
            @RequestParam(defaultValue = "en") String locale) {
        List<HeroSlider> sliders = heroSliderRepository.findByIsActiveTrueAndLocaleOrderBySortOrder(locale);
        return ResponseEntity.ok(sliders);
    }
    
    @GetMapping("/service-features")
    public ResponseEntity<List<ServiceFeature>> getServiceFeatures(
            @RequestParam(defaultValue = "en") String locale) {
        List<ServiceFeature> features = serviceFeatureRepository.findByIsActiveTrueAndLocaleOrderBySortOrder(locale);
        return ResponseEntity.ok(features);
    }
}
```

## Frontend Integration

Update your frontend to fetch data from these new API endpoints instead of using static JSON files.

### Example API Service
```typescript
export const homepageService = {
  getHeroSliders: async (locale = 'en') => {
    const response = await fetch(`/api/homepage/hero-sliders?locale=${locale}`);
    return response.json();
  },
  
  getServiceFeatures: async (locale = 'en') => {
    const response = await fetch(`/api/homepage/service-features?locale=${locale}`);
    return response.json();
  }
};
```

## Notes

- ObjectIds are generated automatically by MongoDB if not provided
- The `locale` field supports internationalization
- `isActive` allows you to hide/show items without deleting them
- `sortOrder` controls the display sequence
- Timestamps help with auditing and caching strategies
- Consider adding indexes on frequently queried fields like `isActive`, `locale`, and `sortOrder`

## Indexes Recommendations

```javascript
// Create indexes for better performance
db.heroSliders.createIndex({ "isActive": 1, "locale": 1, "sortOrder": 1 })
db.serviceFeatures.createIndex({ "isActive": 1, "locale": 1, "sortOrder": 1 })
```

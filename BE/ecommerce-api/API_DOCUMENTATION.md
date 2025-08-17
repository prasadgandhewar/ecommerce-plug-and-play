# E-commerce API Documentation

## Overview

This is a comprehensive REST API for an e-commerce application built with Spring Boot 3.2.0 and Java 17. The API provides complete functionality for user authentication, product management, shopping cart operations, and order processing.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL database
- MongoDB (for some features)

### Running the Application
```bash
cd BE/ecommerce-api
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

## 📋 API Documentation

### Swagger/OpenAPI Documentation

The complete API documentation is available in the `swagger.yaml` file in this directory. You can view it using:

#### Option 1: Swagger Editor Online
1. Go to [Swagger Editor](https://editor.swagger.io/)
2. Copy the contents of `swagger.yaml` and paste it into the editor
3. View the interactive documentation with the ability to test endpoints

#### Option 2: Local Swagger UI
1. Install swagger-ui-express or use a local Swagger UI setup
2. Serve the `swagger.yaml` file through Swagger UI

#### Option 3: VS Code Extension
1. Install the "Swagger Viewer" extension in VS Code
2. Open the `swagger.yaml` file
3. Use the preview option to view the documentation

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register a new account via `POST /auth/register` or login via `POST /auth/login`
2. Include the received JWT token in the Authorization header: `Bearer <token>`

### Example Authentication Flow
```bash
# Register a new user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "password123"
  }'

# Login to get JWT token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Use the token for authenticated requests
curl -X GET http://localhost:8080/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🛍️ API Endpoints Overview

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `GET /auth/check-email/{email}` - Check email availability
- `POST /auth/logout` - User logout

### Product Management
- `GET /products` - Get all products with pagination and filtering
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create new product (Admin only)
- `PUT /products/{id}` - Update product (Admin only)
- `DELETE /products/{id}` - Delete product (Admin only)
- `GET /products/category/{category}` - Get products by category
- `GET /products/search?name={name}` - Search products by name
- `GET /products/price-range?minPrice={min}&maxPrice={max}` - Filter by price range

### Shopping Cart
- `GET /cart/user/{userId}` - Get user's cart items
- `POST /cart/add` - Add item to cart
- `PUT /cart/{id}` - Update cart item quantity
- `DELETE /cart/{id}` - Remove item from cart
- `DELETE /cart/user/{userId}/clear` - Clear all cart items
- `GET /cart/user/{userId}/count` - Get cart item count
- `GET /cart/user/{userId}/total` - Get cart total amount

### Order Management
- `GET /orders` - Get all orders with pagination (Admin only)
- `POST /orders` - Create new order from cart
- `GET /orders/{id}` - Get order by ID
- `PUT /orders/{id}/status` - Update order status (Admin only)
- `GET /orders/user/{userId}` - Get user's orders
- `GET /orders/status/{status}` - Get orders by status (Admin only)
- `PUT /orders/{id}/cancel` - Cancel order
- `DELETE /orders/{id}` - Delete order (Admin only)

### User Management
- `GET /users` - Get all users with pagination (Admin only)
- `POST /users` - Create new user (Admin only)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user information
- `DELETE /users/{id}` - Delete user (Admin only)
- `GET /users/email/{email}` - Get user by email
- `GET /users/role/{role}` - Get users by role (Admin only)

### System
- `GET /test` - API health check

## 📊 Response Formats

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message",
  "timestamp": "2023-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field1": "Validation error message",
    "field2": "Another error message"
  },
  "timestamp": "2023-01-01T00:00:00Z"
}
```

## 🗃️ Data Models

### User
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "role": "USER",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Product
```json
{
  "id": "prod_123",
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 199.99,
  "stockQuantity": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Order
```json
{
  "id": 1,
  "userId": 1,
  "orderNumber": "ORD-2023-001",
  "status": "PENDING",
  "items": [
    {
      "id": 1,
      "productId": "prod_123",
      "productName": "Wireless Headphones",
      "price": 199.99,
      "quantity": 2,
      "subtotal": 399.98
    }
  ],
  "totalAmount": 399.98,
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "credit_card",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

## 🔧 Configuration

### Database Configuration
Update `application.properties` or `application.yml` with your database settings:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# MongoDB Configuration (if used)
spring.data.mongodb.uri=mongodb://localhost:27017/ecommerce_db
```

### JWT Configuration
```properties
# JWT Secret Key (should be environment variable in production)
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

## 🚦 Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 📱 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:3001` (Alternative frontend port)

## 🧪 Testing

### Testing with cURL

#### Register a new user:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "securepassword",
    "phone": "1234567890"
  }'
```

#### Get all products:
```bash
curl -X GET "http://localhost:8080/products?page=0&size=10&sortBy=name&sortDir=asc"
```

#### Add item to cart:
```bash
curl -X POST http://localhost:8080/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "productId": "prod_123",
    "quantity": 2
  }'
```

### Testing with Postman

1. Import the `swagger.yaml` file into Postman
2. Set up environment variables for base URL and JWT token
3. Use the collection to test all endpoints

## 🔍 Monitoring

The API includes Spring Boot Actuator for monitoring:
- Health check: `GET /actuator/health`
- Application info: `GET /actuator/info`
- Metrics: `GET /actuator/metrics`

## 📝 Development Notes

### Key Features
- **JWT Authentication**: Secure token-based authentication
- **Pagination**: All list endpoints support pagination
- **Soft Deletes**: Users and products use soft delete (isActive flag)
- **Validation**: Comprehensive input validation using Bean Validation
- **CORS**: Configured for frontend integration
- **Error Handling**: Consistent error response format

### Database Schema
- **Users**: PostgreSQL table for user accounts
- **Products**: Product catalog with categories and inventory
- **CartItems**: Shopping cart items linked to users
- **Orders**: Order records with status tracking
- **OrderItems**: Individual items within orders

### Security Considerations
- Passwords are encrypted using BCrypt
- JWT tokens have configurable expiration
- Admin-only endpoints are properly secured
- Input validation prevents injection attacks

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add appropriate validation for new endpoints
3. Update this documentation for any API changes
4. Include unit tests for new functionality
5. Update the Swagger specification for new endpoints

## 📞 Support

For API support and questions:
- Email: support@ecommerce-api.com
- Documentation: See `swagger.yaml` for detailed specifications
- Health Check: `GET /test` endpoint for API status

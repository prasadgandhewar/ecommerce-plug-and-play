# E-commerce Frontend Monorepo

This is a monorepo for an e-commerce application featuring both web and mobile platforms using React and React Native.

## Project Structure

```
FE/
├── packages/
│   ├── web/                 # React web application
│   ├── mobile/              # React Native mobile app (iOS & Android)
│   └── shared/              # Shared utilities, types, and API client
├── package.json             # Root package.json with workspace configuration
└── README.md               # This file
```

## Tech Stack

### Web Application
- **React 18** - Modern React with hooks and TypeScript
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **TypeScript** - Type safety

### Mobile Application  
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **React Navigation** - Navigation for React Native
- **TypeScript** - Type safety

### Shared Package
- **TypeScript** - Shared types and interfaces
- **Axios** - HTTP client for API calls
- **Utility functions** - Common helper functions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- For mobile development: Expo CLI

### Installation

1. Clone the repository and navigate to the FE folder:
```bash
cd FE
```

2. Install dependencies for all packages:
```bash
npm run install:all
```

Or install individually:
```bash
# Root dependencies
npm install

# Web app dependencies
npm run install:web

# Mobile app dependencies  
npm run install:mobile
```

### Development

#### Running the Web Application
```bash
npm run web
# or
cd packages/web && npm start
```
The web app will be available at http://localhost:3000

#### Running the Mobile Application
```bash
npm run mobile
# or  
cd packages/mobile && npm start
```

For specific platforms:
```bash
cd packages/mobile
npm run android    # Run on Android
npm run ios        # Run on iOS
```

#### Building the Applications

**Web Build:**
```bash
npm run build:web
# or
cd packages/web && npm run build
```

**Mobile Build:**
```bash
npm run build:mobile
# or
cd packages/mobile && npm run build
```

### Shared Package Development

The shared package contains common utilities, types, and API clients used by both web and mobile applications.

```bash
cd packages/shared
npm run build      # Build the shared package
npm run dev        # Watch mode for development
```

## Scripts

From the root directory:
- `npm run web` - Start web development server
- `npm run mobile` - Start mobile development server  
- `npm run build:web` - Build web application
- `npm run build:mobile` - Build mobile application
- `npm run lint` - Run linting for all packages
- `npm run test` - Run tests for all packages

## Architecture

### Shared Types
Common TypeScript interfaces and types are defined in `packages/shared/src/types/` and can be imported by both web and mobile applications:

```typescript
import { Product, User, Cart } from '@ecommerce/shared';
```

### API Client
A unified API client is available in the shared package with proper error handling and authentication:

```typescript
import { apiClient } from '@ecommerce/shared';

const products = await apiClient.get('/products');
```

### State Management
Both applications use React Context for state management:
- `CartContext` - Shopping cart state
- `UserContext` - User authentication and profile

## Deployment

### Web Application
The web application can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Mobile Application
The mobile application can be built and deployed using:
- Expo Application Services (EAS)
- App Store (iOS)
- Google Play Store (Android)

## Contributing

1. Make changes in the appropriate package
2. Ensure TypeScript compilation passes
3. Run linting and tests
4. Create a pull request

## Package Dependencies

The monorepo uses npm workspaces to manage dependencies efficiently. Shared dependencies are hoisted to the root, while package-specific dependencies remain local.

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Make sure all packages are built, especially the shared package
2. **Import errors**: Verify workspace dependencies are properly linked
3. **Mobile app not starting**: Ensure Expo CLI is installed and updated

### Dependencies Installation
If you encounter dependency issues, try:
```bash
# Clean and reinstall
rm -rf node_modules packages/*/node_modules
npm install
```

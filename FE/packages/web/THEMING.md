# Dynamic Theming System

This application supports multiple UI themes that can be switched at build time or runtime.

## Available Themes

### 1. Plant Theme (Default)
- **Company**: Urban Jungle Co.
- **Industry**: Plants & Gardening
- **Colors**: Green-focused nature theme
- **Content**: Plant-focused copy and imagery

### 2. Tech Theme
- **Company**: TechFlow Store
- **Industry**: Technology & Electronics
- **Colors**: Blue and purple modern theme
- **Content**: Technology-focused copy and imagery

## Build-Time Theme Selection

### Using npm scripts (Windows):
```bash
# Start development server with plant theme
npm run start:plant

# Start development server with tech theme
npm run start:tech

# Build for production with plant theme
npm run build:plant

# Build for production with tech theme
npm run build:tech
```

### Using the theme configuration script:
```bash
# Start with specific theme
node theme-config.js start plant
node theme-config.js start tech

# Build with specific theme
node theme-config.js build plant
node theme-config.js build tech
```

### Using environment variables directly:
```bash
# Windows Command Prompt
set REACT_APP_THEME=tech&& npm start
set REACT_APP_THEME=plant&& npm run build

# Windows PowerShell
$env:REACT_APP_THEME="tech"; npm start
$env:REACT_APP_THEME="plant"; npm run build
```

## Runtime Theme Switching

The application also supports runtime theme switching through the theme switcher component in the header. This allows users to toggle between themes dynamically.

## Theme Configuration

Themes are configured in `/src/config/themes.ts`. Each theme includes:

- **Colors**: Brand colors, primary/accent colors, neutral colors
- **Typography**: Font families for headings and body text
- **Branding**: Company name, tagline, logo icon
- **Content**: Theme-specific copy for hero sections, categories, features, and footer

## Adding New Themes

1. Define your theme in `/src/config/themes.ts`
2. Add the theme to the themes registry
3. Update the build scripts in `package.json`
4. Add your theme to the `availableThemes` array in `theme-config.js`

## File Structure

```
src/
├── config/
│   └── themes.ts              # Theme configurations
├── context/
│   └── ThemeContext.tsx       # Theme context provider
├── styles/
│   └── chakraThemeBuilder.ts  # Chakra UI theme builder
└── components/
    └── common/
        ├── BrandLogo.tsx      # Dynamic branding component
        └── ThemeSwitcher.tsx  # Runtime theme selector
```

## Environment Variables

- `REACT_APP_THEME`: Sets the initial theme (plant, tech)
- If not set, defaults to 'plant' theme

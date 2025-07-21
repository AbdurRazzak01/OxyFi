# Forest ML Analytics - Real-time Satellite Analysis

This project implements real-time forest health monitoring using satellite imagery and machine learning to calculate CO₂ offset estimates and forest health scores.

## 🌲 Features

- **Real-time ML Analysis**: Live forest health assessment using satellite imagery
- **CO₂ Offset Calculation**: Accurate estimates of carbon sequestration potential
- **Interactive Project Cards**: Real-time updates every 30 seconds
- **Detailed Modal Views**: Comprehensive analysis with 15-second refresh rates
- **Automatic Fallback**: Simulated data when ML backend is unavailable
- **Mobile Responsive**: Modern, beautiful UI that works on all devices

## 📁 File Structure

### Core ML Implementation
```
src/utils/ml.ts                 # Main ML backend functions
├── ForestAnalysisResult        # TypeScript interfaces
├── analyzeForestHealth()       # Real ML API communication
├── simulateForestAnalysis()    # Development/fallback simulation
├── getForestAnalysis()         # Smart wrapper with fallbacks
├── useForestAnalysis()         # React hook for real-time updates
└── formatting utilities        # Display formatting functions
```

### UI Components
```
src/components/
├── ProjectCard.tsx             # Interactive project cards (30s updates)
├── ProjectModal.tsx            # Detailed modal view (15s updates)
└── ...existing components
```

### Updated Views
```
src/views/home/index.tsx        # Enhanced with forest project showcase
```

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_ML_BACKEND_URL=https://your-ml-api.com
NEXT_PUBLIC_ML_API_KEY=your_api_key_here
```

### 2. Install and Run
```bash
npm install
npm run dev
```

### 3. Access the Application
Open [http://localhost:3000](http://localhost:3000) to see the forest analytics dashboard.

## 🔧 ML API Integration

### Real ML Backend
The system expects your ML backend to expose a POST endpoint:

```typescript
POST /analyze/forest-health
{
  "imageUrl": "https://satellite-image-url.jpg",
  "coordinates": { "lat": 45.5, "lng": -121.7, "zoom": 14 },
  "requestId": "forest_analysis_1703123456789",
  "timestamp": "2023-12-20T20:30:56.789Z"
}
```

Expected response:
```typescript
{
  "forestHealthScore": 85,        // 0-100 scale
  "co2OffsetEstimate": 125.5,     // tonnes CO₂/year
  "confidence": 0.92,             // 0-1 scale
  "metadata": {
    "areaAnalyzed": 250.0,        // hectares
    "vegetationDensity": 0.78,    // 0-1 scale
    "estimatedTreeCount": 4250
  }
}
```

### Development Mode
Without an API key, the system automatically uses realistic simulated data:
- Consistent results based on image URL hash
- Realistic forest health scores (60-95%)
- Proportional CO₂ estimates
- Varied but believable metadata

## 🎨 Components Usage

### ProjectCard Component
```tsx
import ProjectCard from '../components/ProjectCard';

const project = {
  id: '1',
  name: 'Amazon Conservation',
  location: 'Brazil',
  imageUrl: 'https://satellite-image.jpg',
  coordinates: { lat: -3.4653, lng: -62.2159 },
  description: 'Conservation project description...'
};

<ProjectCard 
  project={project}
  onViewDetails={(project, analysis) => {
    // Handle modal opening
  }}
/>
```

### ProjectModal Component
```tsx
import ProjectModal from '../components/ProjectModal';

<ProjectModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  project={selectedProject}
  initialAnalysis={analysisData}
/>
```

### useForestAnalysis Hook
```tsx
import { useForestAnalysis } from '../utils/ml';

const { analysis, loading, error } = useForestAnalysis(
  'https://satellite-image.jpg',
  { lat: 45.5, lng: -121.7 },
  30000 // 30 second refresh
);
```

## 📊 ML Analysis Functions

### Core Functions
```typescript
// Direct ML API call with retries and error handling
analyzeForestHealth(imageUrl, coordinates): Promise<ForestAnalysisResult>

// Deterministic simulation for development
simulateForestAnalysis(imageUrl, coordinates): Promise<ForestAnalysisResult>

// Smart wrapper with automatic fallback
getForestAnalysis(imageUrl, coordinates, useSimulation?): Promise<ForestAnalysisResult>
```

### Utility Functions
```typescript
// Format health score with color coding
formatHealthScore(score): { text, color, description }

// Format CO₂ estimates for display
formatCO2Offset(offset): string

// React hook for real-time updates
useForestAnalysis(imageUrl, coordinates, refreshInterval): { analysis, loading, error }
```

## 🎯 Real-time Updates

### Update Frequencies
- **Project Cards**: 30 seconds - Balances freshness with API usage
- **Modal Views**: 15 seconds - More frequent for detailed analysis
- **Error Retry**: Exponential backoff (1s, 2s, 4s intervals)

### Performance Optimizations
- Automatic request cancellation on component unmount
- Debounced API calls to prevent rate limiting
- Smart caching with URL-based consistency
- Graceful degradation on API failures

## 🎨 UI Features

### Visual Indicators
- **Live Analysis Badge**: Green pulsing dot indicates real-time updates
- **Health Score Colors**: Green (80%+), Yellow (40-79%), Red (<40%)
- **Loading States**: Smooth skeleton loading animations
- **Confidence Indicators**: Visual confidence percentage display

### Responsive Design
- Mobile-first responsive grid layout
- Touch-friendly modal interactions
- Optimized image loading with fallbacks
- Accessibility-compliant keyboard navigation

## 🔧 Configuration

### ML Backend Configuration
```typescript
const ML_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_ML_BACKEND_URL || 'https://api.forestml.example.com',
  apiKey: process.env.NEXT_PUBLIC_ML_API_KEY || '',
  timeout: 30000,    // 30 seconds
  retries: 3,        // Retry attempts
};
```

### Customization Options
- Adjust refresh intervals per component
- Customize health score thresholds and colors
- Configure retry logic and timeouts
- Modify simulation parameters for development

## 🚨 Error Handling

### Graceful Fallbacks
1. **API Timeout**: Falls back to simulated data
2. **Rate Limiting**: Implements exponential backoff
3. **Network Errors**: Shows user-friendly error messages
4. **Invalid Data**: Validates and sanitizes all responses

### Development Features
- Console logging for debugging
- Simulated network delays for testing
- Consistent results for same inputs
- Error boundary protection

## 🔮 Future Enhancements

### Planned Features
- Historical trend analysis
- Comparative forest health metrics
- Export functionality for analysis data
- Real-time satellite imagery integration
- Advanced filtering and search capabilities

### ML Model Improvements
- Multi-spectral image analysis
- Seasonal trend detection
- Deforestation alert system
- Biodiversity index calculations

## 📝 Sample Projects

The application includes 4 sample projects showcasing different forest types:

1. **Amazon Rainforest Conservation** (Brazil)
2. **Pacific Northwest Reforestation** (Oregon, USA)
3. **Boreal Forest Research Site** (Manitoba, Canada)
4. **Tropical Forest Restoration** (Costa Rica)

Each project demonstrates different forest health scenarios and CO₂ offset potentials.

## 🛠️ Development

### Build and Test
```bash
npm run build    # Production build
npm run start    # Start production server
npm run dev      # Development server
```

### TypeScript Support
Full TypeScript support with comprehensive type definitions for all ML analysis data structures and component props.

## 📄 License

This ML analytics extension follows the same license as the base Solana dApp template.

---

🌲 **Happy Forest Monitoring!** 🌲
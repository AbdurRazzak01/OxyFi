# TimelapseViewer Component

A React component for displaying satellite imagery timelapses with AI-powered health prediction overlays.

## Features

- **Satellite Imagery Fetching**: Connects to satellite image APIs to fetch time-series imagery
- **Interactive Timeline Controls**: Play, pause, stop, and seek through image sequences
- **ML Health Predictions**: Real-time vegetation health analysis using machine learning models
- **Visual Overlays**: Health score indicators, classification labels, and issue detection
- **Responsive Design**: Works on desktop and mobile devices
- **Configurable Playback**: Variable speed controls and manual frame navigation

## Component Structure

```
components/
├── TimelapseViewer.tsx          # Main component
pages/api/
├── satellite/
│   └── images.ts               # Satellite imagery API endpoint
└── ml/
    └── predict-health.ts       # ML prediction API endpoint
pages/
└── timelapse-demo.tsx          # Demo page showcasing the component
```

## Usage

```tsx
import TimelapseViewer from '../components/TimelapseViewer';

<TimelapseViewer
  projectId="project-001"
  coordinates={{ lat: 37.7749, lng: -122.4194 }}
  dateRange={{
    start: new Date('2023-01-01'),
    end: new Date('2023-12-31')
  }}
  onPredictionUpdate={(prediction) => {
    console.log('New ML prediction:', prediction);
  }}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `projectId` | `string` | Unique identifier for the project |
| `coordinates` | `{lat: number, lng: number}` | Geographic coordinates for imagery |
| `dateRange` | `{start: Date, end: Date}` | Time range for satellite imagery |
| `onPredictionUpdate` | `(prediction: MLPrediction) => void` | Callback for ML prediction updates |

## API Endpoints

### `/api/satellite/images`

Fetches satellite imagery for specified coordinates and date range.

**Request:**
```json
{
  "projectId": "string",
  "coordinates": {"lat": number, "lng": number},
  "dateRange": {"start": "ISO date", "end": "ISO date"}
}
```

**Response:**
```json
{
  "images": [
    {
      "id": "string",
      "url": "string",
      "timestamp": "ISO date",
      "coordinates": {"lat": number, "lng": number}
    }
  ],
  "totalCount": number
}
```

### `/api/ml/predict-health`

Analyzes satellite imagery using ML models for vegetation health.

**Request:**
```json
{
  "imageUrl": "string",
  "imageId": "string", 
  "projectId": "string",
  "coordinates": {"lat": number, "lng": number}
}
```

**Response:**
```json
{
  "healthScore": number,
  "classification": "healthy|stressed|diseased|dead",
  "confidence": number,
  "detectedIssues": ["string"],
  "timestamp": "ISO date",
  "analysis": {
    "vegetationIndex": number,
    "moistureContent": number,
    "temperatureAnomaly": number,
    "changeDetection": ["string"]
  }
}
```

## ML Integration

The component integrates with machine learning models for:

- **Vegetation Health Analysis**: NDVI calculations and health scoring
- **Disease Detection**: Identification of plant diseases and stress factors
- **Change Detection**: Monitoring vegetation changes over time
- **Anomaly Detection**: Identification of unusual patterns or conditions

### Supported ML Platforms

The API is designed to work with:
- TensorFlow Serving
- PyTorch Serve
- Amazon SageMaker
- Google AI Platform
- Azure Machine Learning
- Custom ML APIs

## Satellite Data Sources

The component can integrate with various satellite imagery providers:

- **Google Earth Engine**: Large-scale geospatial analysis
- **Sentinel Hub**: Copernicus Sentinel satellite data
- **Planet Labs**: High-resolution daily imagery
- **NASA Earthdata**: Scientific satellite observations
- **Landsat**: Long-term earth observation data

## Environment Variables

Configure the following environment variables for production use:

```env
# Satellite Imagery API
SATELLITE_API_URL=https://api.satellite-provider.com
SATELLITE_API_KEY=your_satellite_api_key

# Machine Learning API
ML_API_URL=https://api.ml-service.com
ML_API_KEY=your_ml_api_key
ML_MODEL_VERSION=v1.0
```

## Demo Page

Visit `/timelapse-demo` to see the component in action with:

- Sample project locations (San Francisco, Central Valley, Marin County, Napa Valley)
- Interactive controls for coordinates and date ranges
- Real-time prediction updates and history
- Usage instructions and guidance

## Technical Details

### Canvas Rendering

The component uses HTML5 Canvas for:
- Efficient image rendering
- Real-time overlay drawing
- Health indicator visualization
- Performance optimization

### State Management

- React hooks for component state
- Efficient prediction caching
- Automatic cleanup of intervals and resources

### Error Handling

- Graceful fallbacks for API failures
- Mock data for development and testing
- User-friendly error messages
- Retry mechanisms

## Customization

The component can be customized for different use cases:

- **Agriculture**: Crop health monitoring, yield prediction
- **Forestry**: Forest health assessment, deforestation tracking
- **Urban Planning**: Green space monitoring, heat island effects
- **Environmental**: Climate change impacts, ecosystem health
- **Research**: Scientific analysis, data collection

## Performance Considerations

- Image preloading and caching
- Debounced API calls
- Canvas optimization
- Memory management for large datasets
- Progressive loading for better UX

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Requires modern browser features:
- Canvas 2D API
- Fetch API
- ES6+ JavaScript features
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  CpuChipIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Project {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  description: string;
  aiScore: number;
  treesPlanted: number;
  co2Offset: number;
  fundingProgress: number;
  fundingTarget: number;
  fundingRaised: number;
  status: string;
  verified: boolean;
  socialEngagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ProjectMapProps {
  projects: Project[];
}

const ProjectMap: React.FC<ProjectMapProps> = ({ projects }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Ecuador
    const map = L.map(mapRef.current).setView([-1.8312, -78.1834], 6);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom icon for projects
    const createCustomIcon = (aiScore: number, verified: boolean) => {
      const color = aiScore >= 90 ? '#10B981' : aiScore >= 80 ? '#F59E0B' : '#EF4444';
      const iconHtml = `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <span style="
            color: white;
            font-weight: bold;
            font-size: 10px;
          ">${aiScore}</span>
          ${verified ? `
            <div style="
              position: absolute;
              top: -5px;
              right: -5px;
              background-color: #3B82F6;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              border: 2px solid white;
            ">
              <svg style="width: 10px; height: 10px; margin: 1px;" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          ` : ''}
        </div>
      `;

      return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });
    };

    // Add markers for each project
    projects.forEach((project) => {
      const marker = L.marker(
        [project.coordinates.lat, project.coordinates.lng],
        { icon: createCustomIcon(project.aiScore, project.verified) }
      ).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="position: relative; margin-bottom: 12px;">
            <img 
              src="${project.imageUrl}" 
              alt="${project.name}"
              style="
                width: 100%;
                height: 120px;
                object-fit: cover;
                border-radius: 8px;
              "
            />
            <div style="
              position: absolute;
              top: 8px;
              right: 8px;
              background: rgba(255,255,255,0.9);
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              color: #059669;
            ">
              AI Score: ${project.aiScore}
            </div>
            ${project.verified ? `
              <div style="
                position: absolute;
                top: 8px;
                left: 8px;
                background: #3B82F6;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg style="width: 12px; height: 12px;" fill="white" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            ` : ''}
          </div>
          
          <div style="margin-bottom: 8px;">
            <h3 style="
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 4px 0;
              color: #111827;
            ">${project.name}</h3>
            <p style="
              font-size: 12px;
              color: #6B7280;
              margin: 0;
            ">${project.location}</p>
          </div>
          
          <p style="
            font-size: 13px;
            color: #4B5563;
            margin: 0 0 12px 0;
            line-height: 1.4;
          ">${project.description}</p>
          
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            text-align: center;
          ">
            <div>
              <div style="
                font-size: 14px;
                font-weight: 700;
                color: #059669;
              ">${(project.treesPlanted / 1000).toFixed(0)}k</div>
              <div style="
                font-size: 10px;
                color: #6B7280;
              ">Trees</div>
            </div>
            <div>
              <div style="
                font-size: 14px;
                font-weight: 700;
                color: #2563EB;
              ">${project.co2Offset}</div>
              <div style="
                font-size: 10px;
                color: #6B7280;
              ">CO₂ tons/yr</div>
            </div>
            <div>
              <div style="
                font-size: 14px;
                font-weight: 700;
                color: #7C3AED;
              ">${Math.round(project.fundingProgress * 100)}%</div>
              <div style="
                font-size: 10px;
                color: #6B7280;
              ">Funded</div>
            </div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin-bottom: 4px;
            ">
              <span style="color: #6B7280;">Funding Progress</span>
              <span style="font-weight: 600; color: #111827;">
                $${(project.fundingRaised / 1000000).toFixed(1)}M / $${(project.fundingTarget / 1000000).toFixed(1)}M
              </span>
            </div>
            <div style="
              width: 100%;
              height: 6px;
              background-color: #E5E7EB;
              border-radius: 3px;
              overflow: hidden;
            ">
              <div style="
                width: ${project.fundingProgress * 100}%;
                height: 100%;
                background: linear-gradient(to right, #10B981, #059669);
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>
          
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div style="
              display: flex;
              gap: 12px;
              font-size: 11px;
              color: #6B7280;
            ">
              <span>❤️ ${project.socialEngagement.likes}</span>
              <span>🔄 ${project.socialEngagement.shares}</span>
              <span>💬 ${project.socialEngagement.comments}</span>
            </div>
            <button style="
              background: linear-gradient(to right, #10B981, #059669);
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
            " onclick="alert('Investment feature coming soon!')">
              Invest Now
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'custom-popup'
      });
    });

    // Add custom CSS for popup styling
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border: none;
      }
      .custom-popup .leaflet-popup-content {
        margin: 16px;
      }
      .custom-popup .leaflet-popup-tip {
        background: white;
        box-shadow: 0 3px 14px rgba(0,0,0,0.15);
      }
      .custom-marker {
        background: none !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(style);
    };
  }, [projects]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">AI Health Scores</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">90-100 (Excellent)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">80-89 (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Below 80 (Needs Attention)</span>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Verified Project</span>
          </div>
        </div>
      </div>

      {/* Map Controls Info */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 z-[1000]">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 mb-1">
            <MapPinIcon className="w-3 h-3" />
            <span>Click markers for project details</span>
          </div>
          <div className="flex items-center gap-2">
            <CpuChipIcon className="w-3 h-3" />
            <span>Real-time AI health monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
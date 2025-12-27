// src/components/MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet icon path issues (common in Vite)
import 'leaflet/dist/leaflet.css';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapMarker {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  type: string;
}

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 12,
  markers,
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);
    mapInstance.current = map;

    // Add OpenStreetMap tile layer (free, no key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker layer
    const layer = L.layerGroup().addTo(map);
    markerLayer.current = layer;

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  // Update center & zoom
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    // Early exit if refs are not ready
    if (!markerLayer.current || !mapInstance.current) return;

    // ✅ Capture non-null reference to satisfy TypeScript
    const layer = markerLayer.current;
    layer.clearLayers();

    markers.forEach(marker => {
      const icon = L.icon({
        iconUrl: marker.type === 'user'
          ? 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
          : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const markerEl = L.marker([marker.coordinates.lat, marker.coordinates.lng], { icon })
        .addTo(layer) // ✅ Now safe: `layer` is L.LayerGroup (non-null)
        .bindPopup(`<b>${marker.name}</b><br>${marker.type}`);

      if (onMarkerClick) {
        markerEl.on('click', () => onMarkerClick(marker));
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
      style={{ minHeight: '256px' }}
    />
  );
};

export default MapComponent;
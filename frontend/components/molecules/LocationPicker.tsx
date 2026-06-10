'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';

interface LocationPickerProps {
  coords: { lat: number; lng: number };
  onCoordsChange: (coords: { lat: number; lng: number }) => void;
  onUseCurrentLocation: () => void;
}

export function LocationPicker({ coords, onCoordsChange, onUseCurrentLocation }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coords.lng, coords.lat],
      zoom: 11,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLngLat();
      onCoordsChange({ lat: pos.lat, lng: pos.lng });
    });

    markerRef.current = marker;
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.flyTo({ center: [coords.lng, coords.lat], zoom: 14 });
    markerRef.current?.setLngLat([coords.lng, coords.lat]);
  }, [coords.lat, coords.lng]);

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body p-0">
        <div className="map-panel p-4">
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div>
              <p className="text-uppercase text-muted small mb-1">Location picker</p>
              <h2 className="h5 mb-0">City of Johannesburg Ward 23</h2>
            </div>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={onUseCurrentLocation}>
              Use current location
            </button>
          </div>
          <div className="mapbox-container mb-3" ref={mapContainer} />
          <p className="text-muted small mb-0">Drag the pin on the map for accuracy, or use your current location.</p>
        </div>
      </div>
    </div>
  );
}

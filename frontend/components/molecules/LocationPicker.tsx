'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

interface LocationPickerProps {
  coords: { lat: number; lng: number };
  onCoordsChange: (coords: { lat: number; lng: number }) => void;
  onUseCurrentLocation: () => void;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? '';

export function LocationPicker({ coords, onCoordsChange, onUseCurrentLocation }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<import('mapbox-gl').Map | null>(null);
  const markerRef = useRef<import('mapbox-gl').Marker | null>(null);
  const onCoordsChangeRef = useRef(onCoordsChange);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    onCoordsChangeRef.current = onCoordsChange;
  }, [onCoordsChange]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxToken) {
      setMapError('Map unavailable: set NEXT_PUBLIC_MAPBOX_TOKEN in frontend/.env and restart the dev server.');
      return;
    }

    let cancelled = false;

    async function initMap() {
      try {
        const mapboxModule = await import('mapbox-gl');

        const mapboxgl = mapboxModule.default;
        const workerUrl = (await import('mapbox-gl/dist/mapbox-gl-csp-worker?url')).default;
        mapboxgl.workerUrl = workerUrl;
        mapboxgl.accessToken = mapboxToken;

        if (cancelled || !mapContainer.current) return;

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
          onCoordsChangeRef.current({ lat: pos.lat, lng: pos.lng });
        });

        map.on('load', () => {
          map.resize();
        });

        markerRef.current = marker;
        mapInstance.current = map;
        setMapError('');
      } catch {
        if (!cancelled) {
          setMapError('Unable to load the map. Check your Mapbox token and try again.');
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
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
          {mapError ? (
            <div className="alert alert-warning mb-3">{mapError}</div>
          ) : null}
          <div className="mapbox-container mb-3" ref={mapContainer} />
          <p className="text-muted small mb-0">Drag the pin on the map for accuracy, or use your current location.</p>
        </div>
      </div>
    </div>
  );
}

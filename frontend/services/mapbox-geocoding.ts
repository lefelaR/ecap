import { getMapboxToken, isMapboxConfigured } from '@/lib/mapbox';

export interface AddressSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface MapboxGeocodingResponse {
  features: MapboxFeature[];
}

export async function fetchAddressSuggestions(
  query: string,
  proximity?: { lat: number; lng: number },
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 3 || !isMapboxConfigured()) {
    return [];
  }

  const params = new URLSearchParams({
    access_token: getMapboxToken(),
    autocomplete: 'true',
    country: 'ZA',
    types: 'address,place,locality,neighborhood,poi',
    limit: '5',
  });

  if (proximity) {
    params.set('proximity', `${proximity.lng},${proximity.lat}`);
  }

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json?${params}`,
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as MapboxGeocodingResponse;

  return data.features.map((feature) => ({
    id: feature.id,
    label: feature.place_name,
    lng: feature.center[0],
    lat: feature.center[1],
  }));
}

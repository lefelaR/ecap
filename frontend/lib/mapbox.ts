export function getMapboxToken(): string {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? '';
}

export function isMapboxConfigured(): boolean {
  return Boolean(getMapboxToken());
}

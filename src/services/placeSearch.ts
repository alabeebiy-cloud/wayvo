/**
 * Live place search for anywhere in Nigeria, using OpenStreetMap's free "Nominatim" service
 * (no account or key needed). It is meant for light, demonstration use: the search box waits
 * until the person stops typing before it asks.
 * If the service cannot be reached, the caller falls back to the built-in places.
 */
import { getLocationName, makeGeoId } from './mockLocations';

export interface PlaceOption {
  id: string;
  name: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string>;
}

const ENDPOINT = 'https://nominatim.openstreetmap.org/search';

function isResult(v: unknown): v is NominatimResult {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;
  return typeof r.lat === 'string' && typeof r.lon === 'string' && typeof r.display_name === 'string';
}

/** "Badagry, Badagry, Lagos": the place, its area, and its state, with no repeats. */
function labelFor(r: NominatimResult): string {
  const a = r.address ?? {};
  const first = (r.name || r.display_name.split(',')[0] || '').trim();
  const area = a.suburb || a.neighbourhood || a.city_district || a.town || a.city
    || a.village || a.municipality || a.county || a.state_district || '';
  const state = (a.state || '').replace(/ State$/i, '');
  const unique: string[] = [];
  [first, area, state].forEach((part) => {
    const t = part.trim();
    if (t && unique.indexOf(t) === -1) unique.push(t);
  });
  return unique.join(', ');
}

/** Searches Nigeria only. Throws if the service cannot be reached. */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceOption[]> {
  const url = `${ENDPOINT}?format=jsonv2&countrycodes=ng&addressdetails=1&limit=8&accept-language=en&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Place search failed (${response.status})`);
  const data: unknown = await response.json();
  if (!Array.isArray(data)) return [];

  const found: PlaceOption[] = [];
  const seen: string[] = [];
  data.forEach((item) => {
    if (!isResult(item)) return;
    const id = makeGeoId(labelFor(item), parseFloat(item.lat), parseFloat(item.lon));
    if (!id) return;
    const name = getLocationName(id);
    if (seen.indexOf(name.toLowerCase()) !== -1) return;
    seen.push(name.toLowerCase());
    found.push({ id, name });
  });
  return found;
}

// ---------- driving route (for the map) ----------
export interface RouteInfo {
  /** Road distance in km. */
  distanceKm: number;
  /** Points of the route as [latitude, longitude]. */
  path: Array<[number, number]>;
}

const ROUTE_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving';

/** Asks the free OSRM demo service for the driving route. Throws if it cannot be reached. */
export async function getRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  signal?: AbortSignal,
): Promise<RouteInfo> {
  const url = `${ROUTE_ENDPOINT}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=simplified&geometries=geojson`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Route lookup failed (${response.status})`);
  const data = (await response.json()) as {
    routes?: Array<{ distance?: number; geometry?: { coordinates?: Array<[number, number]> } }>;
  };
  const route = data.routes && data.routes[0];
  const coords = route && route.geometry && route.geometry.coordinates;
  if (!route || typeof route.distance !== 'number' || !coords || coords.length < 2) {
    throw new Error('No driving route found');
  }
  return {
    distanceKm: route.distance / 1000,
    path: coords.map(([lng, lat]) => [lat, lng] as [number, number]),
  };
}
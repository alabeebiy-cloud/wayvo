/**
 * Demonstration locations across Nigeria.
 * 49 built-in places, plus any place found with the search bar (see placeSearch.ts).
 * Distances are ESTIMATES, not real routing:
 *  - pairs of Lagos landmarks use a fixed hand-written table (km);
 *  - every other pair uses the straight-line distance between the two points
 *    multiplied by a road factor (roads are longer than a straight line).
 * Replace this file with a maps API later without touching the rest of the app.
 */
export interface MockLocation {
  id: string;
  name: string;
  /** State (or region) shown to the user. */
  area: string;
  lat: number;
  lng: number;
}

type Raw = [id: string, name: string, area: string, lat: number, lng: number];

const RAW: Raw[] = [
  // Lagos landmarks (kept from the first version, so older bookings stay valid)
  ['ikeja', 'Ikeja City Mall, Lagos', 'Lagos', 6.6129, 3.3569],
  ['airport', 'Murtala Muhammed Airport, Lagos', 'Lagos', 6.5774, 3.3212],
  ['maryland', 'Maryland Mall, Lagos', 'Lagos', 6.5666, 3.3646],
  ['yaba', 'Yaba Tech Roundabout, Lagos', 'Lagos', 6.5176, 3.3769],
  ['surulere', 'National Stadium, Surulere, Lagos', 'Lagos', 6.4997, 3.3683],
  ['marina', 'Marina Waterfront, Lagos', 'Lagos', 6.4488, 3.395],
  ['ikoyi', 'Ikoyi Obalende Junction, Lagos', 'Lagos', 6.451, 3.4],
  ['vi', 'Victoria Island Circle, Lagos', 'Lagos', 6.4281, 3.4219],
  ['lekki', 'Lekki Phase 1 Gate, Lagos', 'Lagos', 6.4474, 3.4723],
  ['ajah', 'Ajah Roundabout, Lagos', 'Lagos', 6.4698, 3.5852],

  // South-West
  ['ibadan', 'Ibadan, Oyo', 'Oyo', 7.3775, 3.947],
  ['abeokuta', 'Abeokuta, Ogun', 'Ogun', 7.1475, 3.3619],
  ['akure', 'Akure, Ondo', 'Ondo', 7.2526, 5.1931],
  ['osogbo', 'Osogbo, Osun', 'Osun', 7.7719, 4.556],
  ['adoekiti', 'Ado-Ekiti, Ekiti', 'Ekiti', 7.6211, 5.2214],

  // North-Central
  ['abuja', 'Abuja, FCT', 'FCT', 9.0765, 7.3986],
  ['ilorin', 'Ilorin, Kwara', 'Kwara', 8.4966, 4.5421],
  ['jos', 'Jos, Plateau', 'Plateau', 9.8965, 8.8583],
  ['lokoja', 'Lokoja, Kogi', 'Kogi', 7.8023, 6.7333],
  ['lafia', 'Lafia, Nasarawa', 'Nasarawa', 8.4939, 8.5153],
  ['makurdi', 'Makurdi, Benue', 'Benue', 7.7337, 8.5214],
  ['minna', 'Minna, Niger', 'Niger', 9.6139, 6.5569],

  // South-South
  ['benin', 'Benin City, Edo', 'Edo', 6.335, 5.6037],
  ['warri', 'Warri, Delta', 'Delta', 5.516, 5.75],
  ['asaba', 'Asaba, Delta', 'Delta', 6.198, 6.7336],
  ['portharcourt', 'Port Harcourt, Rivers', 'Rivers', 4.8156, 7.0498],
  ['uyo', 'Uyo, Akwa Ibom', 'Akwa Ibom', 5.0377, 7.9128],
  ['calabar', 'Calabar, Cross River', 'Cross River', 4.9589, 8.3269],
  ['yenagoa', 'Yenagoa, Bayelsa', 'Bayelsa', 4.9267, 6.2676],

  // South-East
  ['enugu', 'Enugu, Enugu', 'Enugu', 6.4584, 7.5464],
  ['onitsha', 'Onitsha, Anambra', 'Anambra', 6.145, 6.785],
  ['awka', 'Awka, Anambra', 'Anambra', 6.21, 7.07],
  ['owerri', 'Owerri, Imo', 'Imo', 5.484, 7.0351],
  ['aba', 'Aba, Abia', 'Abia', 5.1066, 7.3667],
  ['umuahia', 'Umuahia, Abia', 'Abia', 5.525, 7.49],
  ['abakaliki', 'Abakaliki, Ebonyi', 'Ebonyi', 6.3249, 8.1137],

  // North-West
  ['kano', 'Kano, Kano', 'Kano', 12.0022, 8.5919],
  ['kaduna', 'Kaduna, Kaduna', 'Kaduna', 10.5105, 7.4165],
  ['katsina', 'Katsina, Katsina', 'Katsina', 12.9908, 7.6018],
  ['sokoto', 'Sokoto, Sokoto', 'Sokoto', 13.0059, 5.2476],
  ['birninkebbi', 'Birnin Kebbi, Kebbi', 'Kebbi', 12.4539, 4.1975],
  ['gusau', 'Gusau, Zamfara', 'Zamfara', 12.1704, 6.6641],
  ['dutse', 'Dutse, Jigawa', 'Jigawa', 11.704, 9.339],

  // North-East
  ['maiduguri', 'Maiduguri, Borno', 'Borno', 11.8333, 13.15],
  ['yola', 'Yola, Adamawa', 'Adamawa', 9.2035, 12.4954],
  ['bauchi', 'Bauchi, Bauchi', 'Bauchi', 10.3158, 9.8442],
  ['gombe', 'Gombe, Gombe', 'Gombe', 10.2897, 11.1673],
  ['damaturu', 'Damaturu, Yobe', 'Yobe', 11.747, 11.9608],
  ['jalingo', 'Jalingo, Taraba', 'Taraba', 8.893, 11.359],
];

/** Alphabetical, so the pickers are easy to scan. */
export const LOCATIONS: MockLocation[] = RAW
  .map(([id, name, area, lat, lng]) => ({ id, name, area, lat, lng }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Fixed distances (km) between Lagos landmarks.
const LAGOS_PAIRS: Array<[string, string, number]> = [
  ['ikeja', 'airport', 6], ['ikeja', 'maryland', 5], ['ikeja', 'yaba', 12], ['ikeja', 'surulere', 14],
  ['ikeja', 'marina', 20], ['ikeja', 'ikoyi', 20], ['ikeja', 'vi', 23], ['ikeja', 'lekki', 30], ['ikeja', 'ajah', 42],
  ['airport', 'maryland', 9], ['airport', 'yaba', 15], ['airport', 'surulere', 17], ['airport', 'marina', 24],
  ['airport', 'ikoyi', 24], ['airport', 'vi', 27], ['airport', 'lekki', 34], ['airport', 'ajah', 46],
  ['maryland', 'yaba', 8], ['maryland', 'surulere', 12], ['maryland', 'marina', 14], ['maryland', 'ikoyi', 15],
  ['maryland', 'vi', 18], ['maryland', 'lekki', 26], ['maryland', 'ajah', 38],
  ['yaba', 'surulere', 6], ['yaba', 'marina', 9], ['yaba', 'ikoyi', 11], ['yaba', 'vi', 14],
  ['yaba', 'lekki', 22], ['yaba', 'ajah', 34],
  ['surulere', 'marina', 10], ['surulere', 'ikoyi', 13], ['surulere', 'vi', 14], ['surulere', 'lekki', 22], ['surulere', 'ajah', 34],
  ['marina', 'ikoyi', 4], ['marina', 'vi', 5], ['marina', 'lekki', 14], ['marina', 'ajah', 26],
  ['ikoyi', 'vi', 4], ['ikoyi', 'lekki', 12], ['ikoyi', 'ajah', 24],
  ['vi', 'lekki', 9], ['vi', 'ajah', 21],
  ['lekki', 'ajah', 13],
];

const key = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
const FIXED: Record<string, number> = {};
LAGOS_PAIRS.forEach(([a, b, km]) => {
  FIXED[key(a, b)] = km;
});

const EARTH_RADIUS_KM = 6371;
/** Roads are longer than a straight line; 1.3 is a rough average for Nigerian highways. */
const ROAD_FACTOR = 1.3;
const rad = (deg: number): number => (deg * Math.PI) / 180;

function straightLineKm(a: MockLocation, b: MockLocation): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.pow(Math.sin(dLat / 2), 2)
    + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.pow(Math.sin(dLng / 2), 2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// ---------- places found by the live search ----------
// A place picked from the search bar is stored as a text reference, so a booking can keep it
// without any change to the data model:  geo|<lat>|<lng>|<name>
const GEO_PREFIX = 'geo|';

/** Rough box around Nigeria. Anything outside it is rejected, so the app stays Nigeria-only. */
function isInNigeria(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= 4 && lat <= 14 && lng >= 2.5 && lng <= 15;
}

/** Builds a place reference, or null if the place is outside Nigeria or has no name. */
export function makeGeoId(name: string, lat: number, lng: number): string | null {
  if (!isInNigeria(lat, lng)) return null;
  const clean = name.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
  if (!clean) return null;
  return `${GEO_PREFIX}${lat.toFixed(5)}|${lng.toFixed(5)}|${clean}`;
}

/** Reads a place reference. Text from a URL or storage is untrusted, so every part is validated. */
function parseGeoId(id: string): MockLocation | null {
  if (typeof id !== 'string' || id.indexOf(GEO_PREFIX) !== 0) return null;
  const parts = id.split('|');
  if (parts.length < 4) return null;
  const lat = Number(parts[1]);
  const lng = Number(parts[2]);
  const name = parts.slice(3).join('|').trim().slice(0, 120);
  if (!name || !isInNigeria(lat, lng)) return null;
  return { id, name, area: '', lat, lng };
}

export function getLocation(id: string): MockLocation | undefined {
  return LOCATIONS.find((l) => l.id === id) ?? parseGeoId(id) ?? undefined;
}

export function getLocationName(id: string): string {
  const l = getLocation(id);
  return l ? l.name : 'Unknown location';
}

/** Case-insensitive search by name or state. Empty query returns everything. */
export function searchLocations(query: string, exclude?: string): MockLocation[] {
  const q = query.trim().toLowerCase();
  return LOCATIONS.filter(
    (l) => l.id !== exclude && (!q || l.name.toLowerCase().includes(q) || l.area.toLowerCase().includes(q)),
  );
}

/**
 * Estimated road distance in km between two supported locations,
 * or null if the two are identical or unknown.
 */
export function getDistanceKm(fromId: string, toId: string): number | null {
  if (fromId === toId) return null;
  const fixed = FIXED[key(fromId, toId)];
  if (typeof fixed === 'number') return fixed;
  const a = getLocation(fromId);
  const b = getLocation(toId);
  if (!a || !b) return null;
  return Math.max(1, Math.round(straightLineKm(a, b) * ROAD_FACTOR));
}
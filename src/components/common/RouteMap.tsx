import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLocation } from '../../services/mockLocations';

const NIGERIA_CENTRE: [number, number] = [9.082, 8.6753];

// Pins are drawn with plain HTML, so no image files are needed.
const pickupIcon = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#0F8A55;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const destinationIcon = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;background:#14201B;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export interface RouteMapProps {
  /** Place reference of the pickup, or ''. */
  pickup: string;
  /** Place reference of the destination, or ''. */
  destination: string;
  /** The driving route, when known. Otherwise a straight dashed line joins the two pins. */
  path?: Array<[number, number]> | null;
  className?: string;
}

/** Map of Nigeria that shows where you are going: a pin for each place, and the route between them. */
export const RouteMap: React.FC<RouteMapProps> = ({ pickup, destination, path, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(NIGERIA_CENTRE, 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Redraw the pins and route whenever the places change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const from = pickup ? getLocation(pickup) : undefined;
    const to = destination ? getLocation(destination) : undefined;
    const points: L.LatLngExpression[] = [];

    if (from) {
      L.marker([from.lat, from.lng], { icon: pickupIcon, title: from.name }).bindTooltip(`Pickup: ${from.name}`).addTo(layer);
      points.push([from.lat, from.lng]);
    }
    if (to) {
      L.marker([to.lat, to.lng], { icon: destinationIcon, title: to.name }).bindTooltip(`Destination: ${to.name}`).addTo(layer);
      points.push([to.lat, to.lng]);
    }
    if (from && to) {
      if (path && path.length > 1) {
        L.polyline(path, { color: '#0F8A55', weight: 5, opacity: 0.9 }).addTo(layer);
        map.fitBounds(L.latLngBounds(path), { padding: [30, 30] });
      } else {
        L.polyline(points, { color: '#0F8A55', weight: 4, dashArray: '8 10' }).addTo(layer);
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
      }
    } else if (points.length === 1) {
      map.setView(points[0], 12);
    } else {
      map.setView(NIGERIA_CENTRE, 6);
    }
  }, [pickup, destination, path]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Map of your trip"
      className={`relative isolate z-0 h-72 w-full overflow-hidden rounded-2xl border border-ink-100 sm:h-80 ${className ?? ''}`}
    />
  );
};
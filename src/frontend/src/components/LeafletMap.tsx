import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

// Fix default marker icon missing in bundlers
(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl =
  undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
}

interface LeafletMapProps {
  markers: MapMarker[];
  /** Height of the map container in px (default 400) */
  height?: number;
  /** If true, zoom to fit all markers (default true) */
  fitBounds?: boolean;
  /** Single-marker zoom level (default 14) */
  zoom?: number;
  className?: string;
}

export default function LeafletMap({
  markers,
  height = 400,
  fitBounds = true,
  zoom = 14,
  className = "",
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // Serialise markers so useEffect can do a stable equality check
  const markersKey = JSON.stringify(markers);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Default centre: Indonesia
    const defaultCenter: L.LatLngTuple = [-2.5, 118.0];
    const defaultZoom = 5;

    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Parse the stable key back so we have current marker values inside effect
    const currentMarkers: MapMarker[] = JSON.parse(markersKey);

    if (currentMarkers.length > 0) {
      const leafletMarkers: L.Marker[] = [];

      for (const m of currentMarkers) {
        const marker = L.marker([m.lat, m.lng])
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:160px">
               <strong style="display:block;margin-bottom:4px;font-size:13px">${m.title}</strong>
               ${m.subtitle ? `<span style="font-size:11px;color:#666">${m.subtitle}</span>` : ""}
             </div>`,
          );
        leafletMarkers.push(marker);
      }

      if (fitBounds && currentMarkers.length > 1) {
        const group = L.featureGroup(leafletMarkers);
        map.fitBounds(group.getBounds().pad(0.15));
      } else {
        map.setView([currentMarkers[0].lat, currentMarkers[0].lng], zoom);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markersKey, fitBounds, zoom]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-xl overflow-hidden border border-border ${className}`}
      style={{ height: `${height}px` }}
      data-ocid="peta.canvas_target"
    />
  );
}

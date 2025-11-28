'use client';

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

function MapController({ geometry }) {
    const map = useMap();

    useEffect(() => {
        if (geometry) {
            const geoJsonLayer = L.geoJSON(geometry);
            map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
        }
    }, [geometry, map]);

    return null;
}

export default function MapInner({ routeGeometry }) {
    const defaultCenter = [-33.8688, 151.2093]; // Sydney

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)' }}
            className="glass-card"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={defaultCenter}>
                <Popup>
                    Start Point: Sydney
                </Popup>
            </Marker>

            {routeGeometry && (
                <>
                    <GeoJSON key={JSON.stringify(routeGeometry)} data={routeGeometry} style={{ color: 'hsl(250, 80%, 60%)', weight: 5 }} />
                    <MapController geometry={routeGeometry} />
                </>
            )}
        </MapContainer>
    );
}

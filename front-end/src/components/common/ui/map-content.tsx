"use client";

import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type ChangeViewProps = {
    center: LatLngExpression;
    zoom: number;
};

function ChangeView({ center, zoom }: ChangeViewProps) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

type MapContentProps = {
    viewport: {
        lat: number;
        lng: number;
        zoom: number;
    };
    marker: {
        lat: number;
        lng: number;
    } | null;
    query: string;
};

export default function MapContent({
    viewport,
    marker,
    query,
}: MapContentProps) {
    return (
        <Card className="relative z-0 h-[200px] w-full overflow-hidden border-2">
            <MapContainer
                center={[viewport.lat, viewport.lng]}
                zoom={viewport.zoom}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                {marker && (
                    <Marker position={[marker.lat, marker.lng]}>
                        <Popup>
                            <div className="text-sm font-medium">{query}</div>
                        </Popup>
                    </Marker>
                )}
                <ChangeView
                    center={[viewport.lat, viewport.lng]}
                    zoom={viewport.zoom}
                />
            </MapContainer>
        </Card>
    );
}

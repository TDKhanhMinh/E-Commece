"use client";
import React, { Suspense, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import dynamic from "next/dynamic";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    goongPlaceService,
    GoongPlaceSuggestion,
    SelectedPlaceData,
} from "@/service/goong-place-service";

const MapContent = dynamic(() => import("./map-content"), { ssr: false });

type MapAutoCompleteProps = {
    onSelect?: (data: SelectedPlaceData) => void;
    className?: string;
};

type ViewportState = {
    lat: number;
    lng: number;
    zoom: number;
};

type MarkerState = {
    lat: number;
    lng: number;
} | null;

export default function MapAutoComplete({
    onSelect,
    className,
}: MapAutoCompleteProps) {
    const [viewport, setViewport] = useState<ViewportState>({
        lat: 10.762622,
        lng: 106.660172,
        zoom: 17,
    });
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<GoongPlaceSuggestion[]>([]);
    const [marker, setMarker] = useState<MarkerState>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            setLoading(true);
            try {
                const predictions =
                    await goongPlaceService.getAutoComplete(value);
                setSuggestions(predictions);
                setOpen(true);
            } catch (error) {
                console.error("Goong AutoComplete Error:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSuggestions([]);
            setOpen(false);
        }
    };

    const handleSelectPlace = async (place: GoongPlaceSuggestion) => {
        try {
            const data = await goongPlaceService.getPlaceDetail(place.place_id);

            setMarker({ lat: data.latitude, lng: data.longitude });
            setViewport({ lat: data.latitude, lng: data.longitude, zoom: 18 });
            setQuery(data.description);
            setOpen(false);

            if (onSelect) onSelect(data);
        } catch (error) {
            console.error("Goong Detail Error:", error);
        }
    };

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div className="relative w-full">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Tìm kiếm địa điểm..."
                        value={query}
                        onChange={handleSearch}
                        className="focus-visible:ring-primary rounded-sx pl-10"
                    />
                    {loading && (
                        <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
                    )}
                </div>

                {/* Suggestions List */}
                {open && suggestions.length > 0 && (
                    <Card className="absolute z-[1000] mt-1 w-full shadow-lg">
                        <ul className="max-h-[250px] overflow-auto py-1">
                            {suggestions.map((s) => (
                                <li
                                    key={s.place_id}
                                    onClick={() => handleSelectPlace(s)}
                                    className="hover:bg-accent flex cursor-pointer items-start gap-2 px-4 py-2 text-sm transition-colors"
                                >
                                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{s.description}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>

            {/* Map View */}
            <Suspense
                fallback={
                    <Card className="relative z-0 h-[200px] w-full overflow-hidden border-2" />
                }
            >
                <MapContent viewport={viewport} marker={marker} query={query} />
            </Suspense>
        </div>
    );
}

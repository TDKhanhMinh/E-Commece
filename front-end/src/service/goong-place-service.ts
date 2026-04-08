import axios from "axios";

export type GoongPlaceSuggestion = {
    place_id: string;
    description: string;
};

type GoongAutoCompleteResponse = {
    predictions?: GoongPlaceSuggestion[];
};

type GoongPlaceDetailResponse = {
    result: {
        formatted_address: string;
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    };
};

export type SelectedPlaceData = {
    description: string;
    latitude: number;
    longitude: number;
};

const GOONG_PLACES_KEY = "KeONrT42qDbhvyFK5oLjywhE0EAcrxeHh0NTznDz";
const GOONG_BASE_URL = "https://rsapi.goong.io/Place";

class GoongPlaceService {
    async getAutoComplete(input: string): Promise<GoongPlaceSuggestion[]> {
        const response = await axios.get<GoongAutoCompleteResponse>(
            `${GOONG_BASE_URL}/AutoComplete`,
            {
                params: {
                    api_key: GOONG_PLACES_KEY,
                    input,
                },
            }
        );

        return response.data.predictions ?? [];
    }

    async getPlaceDetail(placeId: string): Promise<SelectedPlaceData> {
        const response = await axios.get<GoongPlaceDetailResponse>(
            `${GOONG_BASE_URL}/Detail`,
            {
                params: {
                    place_id: placeId,
                    api_key: GOONG_PLACES_KEY,
                },
            }
        );

        const location = response.data.result.geometry.location;
        return {
            description: response.data.result.formatted_address,
            latitude: location.lat,
            longitude: location.lng,
        };
    }
}

export const goongPlaceService = new GoongPlaceService();


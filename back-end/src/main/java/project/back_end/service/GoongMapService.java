package project.back_end.service;

import org.springframework.stereotype.Service;
import project.back_end.response.DirectionsResponse;

@Service
public interface GoongMapService {
    DirectionsResponse getDirections(double oriLat, double oriLng, double destLat, double destLng);
}

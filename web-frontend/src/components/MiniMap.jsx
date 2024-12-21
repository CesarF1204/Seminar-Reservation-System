import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';

/* Fix for Leaflet default marker icon paths */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MiniMap = ({ seminar }) => {
    /* Extract showToast function from context for displaying notifications */
    const { showToast } = useAppContext();

    /* This should be seminar.venue for later use */
    const address = 'Baguio City, Benguet, Philippines';

    /* Fetch coordinates using react-query */
    const { data: coordinates, isError } = useQuery(
        "getCoordinates",
        () => apiClient.getCoordinates(address),
        {
            suspense: true,
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    /* Check for error state */
    if (isError) {
        showToast({ message: "Failed to load map details. Please try again later.", type: "ERROR" })
    }

    /* Latitude and Longitude */
    const location = [coordinates.lat, coordinates.lon];

    return (
        <div className="flex justify-between items-start">
            <MapContainer
                center={location}
                zoom={18}
                style={{ height: '300px', width: '400px', 'z-index': 0 }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker position={location}>
                    <Popup>{address}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MiniMap;
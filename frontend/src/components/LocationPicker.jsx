import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to add search bar to map
const SearchField = ({ onLocationFound }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            showMarker: false, // We handle our own marker
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: 'Enter address or area'
        });

        // Add the control
        map.addControl(searchControl);

        // Listen for search complete
        map.on('geosearch/showlocation', (result) => {
            if (result && result.location) {
                const { y: lat, x: lng } = result.location;
                onLocationFound(lat, lng);
            }
        });

        // Cleanup
        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation');
        };
    }, [map, onLocationFound]);

    return null;
};

// Sub-component to handle map clicks
const LocationMarkerClick = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const LocationPicker = ({ onLocationSelect, initialPosition = [51.505, -0.09] }) => {
    const [position, setPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState(initialPosition);

    useEffect(() => {
        if (position) {
            onLocationSelect(position[0], position[1]);
        }
    }, [position, onLocationSelect]);

    const handleSearchLocation = (lat, lng) => {
        setPosition([lat, lng]);
        setMapCenter([lat, lng]);
    };

    return (
        <div style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden', zIndex: 0, position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarkerClick position={position} setPosition={setPosition} />
                <SearchField onLocationFound={handleSearchLocation} />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;

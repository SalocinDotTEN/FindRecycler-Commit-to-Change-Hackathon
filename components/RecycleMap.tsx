
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RecyclingFacility, Location } from '../types';

// Fix for default marker icon issues in React environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RecyclerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const UserIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RecycleMapProps {
  facilities: RecyclingFacility[];
  center: Location;
  userLocation: Location | null;
  onSelectFacility: (facility: RecyclingFacility) => void;
}

const ChangeView = ({ center }: { center: Location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
};

const RecycleMap: React.FC<RecycleMapProps> = ({ facilities, center, userLocation, onSelectFacility }) => {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl shadow-inner border border-green-200">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
          <Popup>
            <div className="font-semibold text-blue-600">You are here</div>
          </Popup>
        </Marker>
      )}

      {facilities.map((facility) => (
        <Marker 
          key={facility.id} 
          position={[facility.location.lat, facility.location.lng]}
          icon={RecyclerIcon}
          eventHandlers={{
            click: () => onSelectFacility(facility),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-green-800">{facility.name}</h3>
              <p className="text-xs text-slate-600 mb-2">{facility.address}</p>
              <div className="flex flex-wrap gap-1">
                {facility.materials.slice(0, 3).map(m => (
                  <span key={m} className="px-1 py-0.5 bg-green-100 text-green-700 text-[10px] rounded border border-green-200">{m}</span>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RecycleMap;

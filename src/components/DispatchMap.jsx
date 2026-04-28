import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import NavigateButton from './NavigateButton';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const centerCoordinates = [28.6139, 77.2090]; // New Delhi

const mockTasks = [
  { id: 1, title: 'Medical Evacuation', position: [28.6239, 77.2190], distance: '2.5 km' },
  { id: 2, title: 'Flood Stranded', position: [28.6039, 77.1990], distance: '1.8 km' },
  { id: 3, title: 'Food Supply Drop', position: [28.6339, 77.1890], distance: '4.1 km' },
];

export default function DispatchMap() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 lg:h-[420px]">
      <MapContainer 
        center={centerCoordinates} 
        zoom={12} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Circle center={centerCoordinates} radius={4000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}>
          <Popup>NDRF Main Dispatch Hub</Popup>
        </Circle>

        {mockTasks.map((task) => (
          <Marker key={task.id} position={task.position}>
            <Popup className="custom-popup">
              <div className="flex flex-col gap-2 min-w-[150px]">
                <h3 className="font-bold text-slate-800">{task.title}</h3>
                <p className="text-sm text-slate-600">Distance: {task.distance}</p>
                <NavigateButton
                  latitude={task.position[0]}
                  longitude={task.position[1]}
                  className="mt-2 w-full justify-center rounded bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-cyan-400"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

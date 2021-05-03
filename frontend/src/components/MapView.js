import '../index.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { icono } from '../assets/icono';

export const MapViewCDE = () => {
  return (
    <div>
      <MapContainer center={[-25.495902751512958, -54.72918716247063]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-25.495902751512958, -54.72918716247063]} icon={icono}>
          <Popup>
            Apolo Import
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
export const MapViewVE = () => {
  return (
    <div>
      <MapContainer center={[-25.384632210474166, -57.5925728741161]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-25.384632210474166, -57.5925728741161]} icon={icono}>
          <Popup>
            Apolo Import
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
export const MapViewEN = () => {
  return (
    <div>
      <MapContainer center={[-27.25173748579287, -55.817496487562686]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-27.25173748579287, -55.817496487562686]} icon={icono}>
          <Popup>
            Apolo Import
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapViewCDE

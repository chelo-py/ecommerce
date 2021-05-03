import L from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import shadow from "leaflet/dist/images/marker-shadow.png"

export const icono = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: shadow,
    iconSize: [20, 30], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [10, 44], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 77],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

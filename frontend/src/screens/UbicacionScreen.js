import React from 'react';
import MapViewCDE, { MapViewVE, MapViewEN } from '../components/MapView';

export default function UbicacionScreen() {
    return (
        <div className="contenedor">
            <h1 className="margen-titulo">Dónde Estamos</h1>
            <section className="grid-ubicacion">
                <div>
                    <h2>Apolo - Ciudad del este</h2>
                    <p>Ruta PY 02, KM 13,</p>
                    <p>Lado Monday - Ciudad Del este</p>
                    <p>sac@apolo.com.py</p>
                </div>
                <div>
                    <h2>Apolo - Encarnación</h2>
                    <p>Horacio Gonzalez 1429,</p>
                    <p>-Encarnación</p>
                    <p>sac@apolo.com.py</p>
                </div>
                <div>
                    <h2>Apolo - Villa Elisa</h2>
                    <p>Río Salado 316 y Río Montelindo,</p>
                    <p>Villa Elisa</p>
                    <p>sac@apolo.com.py</p>
                </div>
                <div className="mapa-leaflet">
                    <h2>Localización</h2>
                    <MapViewCDE />
                </div>
                <div className="mapa-leaflet">
                    <h2>Localización</h2>
                    <MapViewEN />
                </div>
                <div className="mapa-leaflet">
                    <h2>Localización</h2>
                    <MapViewVE />
                </div>
            </section>
        </div>
    )
}

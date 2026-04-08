import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para o ícone padrão do Marker no React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export default function HomeMap({ eventos }) {
    // Coordenadas padrão inicial: Centro do Brasil ou Curitiba
    const defaultCenter = [-15.7801, -47.9292]; // Brasil

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '1rem', overflow: 'hidden' }}>
            <MapContainer center={defaultCenter} zoom={4} style={{ height: '300px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {eventos.map((evento) => {
                    if (evento.coordenadas && evento.coordenadas.length === 2) {
                        return (
                            <Marker key={evento.id} position={evento.coordenadas}>
                                <Popup>
                                    <strong>{evento.titulo}</strong> <br />
                                    <span className="text-muted">{evento.categoria}</span>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
}

import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import 'leaflet-defaulticon-compatibility';
import 'leaflet/dist/leaflet.css';

// Icono personalizado dorado
const customIcon = L.icon({
  iconUrl: 'assets/marker-icon-2x-gold.png',
  iconRetinaUrl: 'assets/marker-icon-2x-gold.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

@Component({
  selector: 'app-tiendas',
  standalone: true,
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
  imports: [],
})
export class TiendasComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [40.4168, -3.7038], // Centrado en Madrid
      zoom: 6,
      dragging: true,
      scrollWheelZoom: true,
    });

    // Capas base del mapa
    const baseMaps = {
      'Mapa Estándar': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
      'Vista Satélite': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors',
      }),
      'Modo Noche': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
      }),
    };

    // Añadir la capa estándar por defecto
    baseMaps['Mapa Estándar'].addTo(this.map);

    // Control de capas (para cambiar entre ellas)
    L.control.layers(baseMaps).addTo(this.map);

    // Obtener tiendas desde el backend y agregar los marcadores
    this.http.get<any[]>('http://localhost:8000/tiendas').subscribe(
      (tiendas) => {
        tiendas.forEach((tienda) => {
          console.log(`Añadiendo marcador para ${tienda.name}`);

          // Crear y añadir marcadores con el icono dorado directamente al mapa
          L.marker([tienda.lat, tienda.lng], { icon: customIcon })
            .bindPopup(`<b>${tienda.name}</b><br>Ubicación: ${tienda.lat}, ${tienda.lng}`)
            .addTo(this.map);
        });

        // Ajustar tamaño del mapa después de cargar los marcadores
        setTimeout(() => {
          this.map.invalidateSize();
        }, 500);
      },
      (error) => {
        console.error('Error obteniendo tiendas:', error);
      }
    );
  }
}

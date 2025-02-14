import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClientModule } from '@angular/common/http';
import 'leaflet-defaulticon-compatibility';
import { ChangeDetectorRef } from '@angular/core';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: 'assets/marker-icon-2x-gold.png',
  iconRetinaUrl: 'assets/marker-icon-2x-gold.png',
  iconSize: [25, 41], // Ajusta el tamaño según el icono
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

@Component({
  selector: 'app-tiendas',
  standalone: true,
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
  imports: [HttpClientModule],
})
export class TiendasComponent implements AfterViewInit {
  private map!: L.Map;

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');

    this.map = L.map('map', {
      center: [40.4168, -3.7038], // Madrid como punto inicial
      zoom: 6,
      dragging: true,
      scrollWheelZoom: false,
    });

    console.log('Map initialized');

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('load', () => {
      this.map.invalidateSize();
    });

    console.log('Tile layer added and map size invalidated');

    const tiendas = [
      { name: 'Tienda 1', lat: 40.4168, lng: -3.7038 },
      { name: 'Tienda 2', lat: 41.3879, lng: 2.16992 }
    ];

    tiendas.forEach(tienda => {
      console.log(`Adding marker for ${tienda.name}`);
      L.marker([tienda.lat, tienda.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(tienda.name);
    });

    setTimeout(() => {
      this.map.invalidateSize();
      console.log('Map size invalidated after timeout');
    }, 500);

  }

}

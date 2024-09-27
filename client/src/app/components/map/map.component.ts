import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  async initMap(): Promise<void> {
    if(this.isBrowser){
      const L = await import('leaflet');

    // Inicializa el mapa en una ubicación predeterminada
    this.map = L.map('map').setView([51.505, -0.09], 13);

    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Intenta obtener la ubicación del usuario
    this.getUserLocation(L);
  }
}

  getUserLocation(L: any): void {
    if (this.isBrowser && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Muestra la ubicación del usuario en el mapa
        this.map.setView([userLat, userLng], 13);

        // Agrega un marcador en la ubicación del usuario
        L.marker([userLat, userLng]).addTo(this.map)
          .bindPopup('Estás aquí!')
          .openPopup();
      }, (error) => {
        console.error("Error al obtener la ubicación: ", error);
      });
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
    }
  }

  // Ajustar el tamaño del mapa al redimensionar la ventana
  @HostListener('window:resize')
  onResize() {
    if(this.isBrowser) {
      this.map.invalidateSize();
    }
  }
}

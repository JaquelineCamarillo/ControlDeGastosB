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
  userLocation: { lat: number, lng: number } | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  async initMap(): Promise<void> {
    if (this.isBrowser) {
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
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        this.userLocation = { lat: userLat, lng: userLng };

  
        // Muestra la ubicación del usuario en el mapa con un ícono personalizado
        const userIcon = L.icon({
          iconUrl: 'https://png.pngtree.com/png-vector/20230625/ourmid/pngtree-location-icon-desing-3d-vector-png-image_7316918.png', // Reemplaza con el ícono de tu elección
          iconSize: [50, 50], // Tamaño del ícono
          iconAnchor: [30, 50], // Punto del ícono que se coloca en la ubicación
          popupAnchor: [0, -50] // Punto desde el cual se abrirá el popup
        });
  
        L.marker([userLat, userLng], { icon: userIcon }).addTo(this.map)
          .bindPopup('¡Este eres tú!')


        // Muestra la ubicación del usuario en el mapa
        this.map.setView([userLat, userLng], 18);

        /* Agrega un marcador en la ubicación del usuario
       
        L.marker([userLat, userLng]).addTo(this.map)
          .bindPopup('Este soy eres tu!!!')

          .openPopup();*/
  
        // Llama a la API de Foursquare para obtener lugares cercanos
        await this.getNearbyPlaces(userLat, userLng, L);
      }, (error) => {
        console.error("Error al obtener la ubicación: ", error);
      });
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
    }
  }
  
  async getNearbyPlaces(lat: number, lng: number, L: any): Promise<void> {
    const radius = 2000; // Radio de búsqueda
    const apiKey = 'fsq3lZIDNaFd8/f0V0u61zwK+4CLDjIULoYVKStQJ3xV+Fk='; 
    const limit = 50; // Máximo de lugares
  
    // Solicitud a Foursquare API

    const response = await fetch(`https://api.foursquare.com/v3/places/nearby?ll=${lat},${lng}&radius=${radius}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': apiKey
      }
    });
  
    const data = await response.json();
  
    if (data.results && data.results.length > 0) {
      data.results.forEach((place: any) => {
        const placeLat = place.geocodes.main.latitude;
        const placeLng = place.geocodes.main.longitude;
  
        // Ícono para los lugares de interés
        const placeIcon = L.icon({
          iconUrl: 'https://static.vecteezy.com/system/resources/previews/010/898/274/original/gold-position-sign-png.png', // Reemplaza con el ícono de tu elección
          iconSize: [40, 40], // Tamaño del ícono
          iconAnchor: [25, 40], // Punto del ícono que se coloca en la ubicación
          popupAnchor: [0, -40] // Punto desde el cual se abrirá el popup
        });
  
        L.marker([placeLat, placeLng], { icon: placeIcon }).addTo(this.map)
          .bindPopup(`<b>${place.name}</b><br>${place.location.address}`)
          .openPopup();
      });
    } else {
      console.log('No se encontraron lugares cercanos.');
    }
  }
  

  // Ajustar el tamaño del mapa al redimensionar la ventana
  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.map.invalidateSize();
    }
  }
}
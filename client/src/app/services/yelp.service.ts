import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YelpService {
  private apiKey = 'y0lDXGcxqCMFFW_25rbPYoH792ONT6w29H4N0Z8deR9k5IX6maBgHq9ZClh02HVFvfPYnb3WMioEZWxUy1p2q8jh1F4JzK5zgNGsXlXDXk64YFR0dPKydSPUzBEhZ3Yx'; // Coloca aquí tu API Key de Yelp
  private baseUrl = 'https://api.yelp.com/v3/businesses/search';

  constructor(private http: HttpClient) {}

  searchNearbyBusinesses(lat: number, lng: number, radius: number = 2000, limit: number = 50): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.apiKey}`);
    return this.http.get(`${this.baseUrl}?latitude=${lat}&longitude=${lng}&radius=${radius}&limit=${limit}`, { headers });
  }
}

/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  private clientId = 'cmddxf5uxkmq1jlhvfnkah3pic8p5u'; // Reemplaza con tu Client ID
  private accessToken = '1dczxu41c5qilr4y9mgdabqmusg3jq'; // Reemplaza con tu Access Token
  private baseUrl = 'https://api.twitch.tv/helix/streams';

  constructor(private http: HttpClient) {}

  getStreams(gameId?: string, first: number = 10, language?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${this.accessToken}`
    });

    // Configura los parámetros opcionales solo si están presentes
    const params: any = {
      ...(gameId && { game_id: gameId }),
      first: first.toString(),
      ...(language && { language })
    };

    return this.http.get(this.baseUrl, { headers, params });
  }
}*/


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stream } from 'stream';


@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  private clientId = 'cmddxf5uxkmq1jlhvfnkah3pic8p5u'; // Reemplaza con tu Client ID
  private accessToken = '1dczxu41c5qilr4y9mgdabqmusg3jq'; // Reemplaza con tu Access Token
  private baseUrl = 'https://api.twitch.tv/helix/streams';

  constructor(private http: HttpClient) {}

  getStreams(gameId?: string, first: number = 10, language?: string): Observable<{ data: Stream[] }> {
    const headers = new HttpHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${this.accessToken}`,
    });

    // Configuración de parámetros opcionales
    let params = new HttpParams().set('first', first.toString());
    if (gameId) {
      params = params.set('game_id', gameId);
    }
    if (language) {
      params = params.set('language', language);
    }

    return this.http.get<{ data: Stream[] }>(this.baseUrl, { headers, params });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiUrl = 'https://newsapi.org/v2/everything';
  private apiKey = 'f084f199afcc48058b98e950b6b36c4f'; // Reemplaza con tu clave de API de NewsAPI

  constructor(private http: HttpClient) {}

  getFinancialNews(query: string = 'finanzas'): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('apiKey', this.apiKey);

    return this.http.get(this.apiUrl, { params });
  }
}
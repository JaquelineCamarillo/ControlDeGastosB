import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // Update this to your Express server URL (make sure this is correct)
  private apiUrl = 'http://localhost:3000'; // Change to your actual backend URL

  constructor(private http: HttpClient) {}

  sendEmail(email: string, subject: string, body: string): Observable<any> {
    const emailData = {
      to: email,
      subject: subject,
      text: body // Changed from 'body' to 'text' to match your backend
    };

    // Send a POST request to the backend email endpoint
    return this.http.post<any>(`${this.apiUrl}/send-email`, emailData);
  }
}
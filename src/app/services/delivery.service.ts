import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery,Location } from '../models/delivery.model';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Get recent deliveries
  getRecentDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/recent`);
  }

  // Get top delivery locations
  getTopLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/top`);
  }
}

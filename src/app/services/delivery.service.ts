import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery,Location ,DeliveryStats,StatsCard} from '../models/delivery.model';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getRecentDeliveries(page: number, size: number): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/recent?page=${page}&size=${size}`);
  }

  getTopLocations(page: number, size: number): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/top?page=${page}&size=${size}`);
  }

  getDeliveryStats(): Observable<DeliveryStats> {
    return this.http.get<DeliveryStats>(`${this.apiUrl}/deliveries/stats`);
  }

  getStatsCards(): Observable<StatsCard[]> {
    return this.http.get<StatsCard[]>(`${this.apiUrl}/stats/cards`);
  }
}

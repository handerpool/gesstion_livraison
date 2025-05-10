import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delivery, Location, DeliveryStats, StatsCard, Deliveries } from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getDeliveries(
  page: number,
  size: number,
  status: string,
  searchTerm: string,
  date: string,
  agent: string
): Observable<{ deliveries: Deliveries[]; totalItems: number; totalPages: number; currentPage: number }> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (status && status !== 'all') {
    params = params.set('status', status);
  }
  if (searchTerm) {
    params = params.set('searchTerm', searchTerm);
  }
  if (date) {
    params = params.set('date', date);
  }
  if (agent && agent !== 'all') {
    params = params.set('agent', agent);
  }

  console.log('Sending GET /deliveries with params:', params.toString());

  return this.http
    .get<{ deliveries: Delivery[]; totalItems: number; totalPages: number; currentPage: number }>(
      `${this.apiUrl}/deliveries`,
      { params }
    )
    .pipe(
      map((response) => {
        console.log('Response from /deliveries:', response);
        return {
          deliveries: response.deliveries.map((d: Delivery) => ({
            id: d.id.toString(),
            customer: {
              name: d.customer,
              address: d.address,
              phone: '', // Default value
            },
            status: d.status,
            time: new Date(d.time).toISOString(),
            amount: d.amount,
            courier: d.courier,
            orderId: '',
            estimatedDelivery: '',
            items: 0,
            location: { lat: 0, lng: 0 },
            trackingHistory: [],
          })),
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        };
      })
    );
  }


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
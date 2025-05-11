import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Commande, CommandeResponse, DeliveryStats, StatsCard } from '../models/commande.model';
import { Client } from '../models/client.model';
import { FinancialSummary } from '../models/financial-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient ) {}

  getDeliveries(
    page: number,
    size: number,
    status: string,
    searchTerm: string,
    date: string,
    agent: string
  ): Observable<CommandeResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status)
      .set('searchTerm', searchTerm)
      .set('date', date)
      .set('agent', agent);

    return this.http.get<CommandeResponse>(`${this.apiUrl}/orders`, { params }).pipe(
      catchError((err) => {
        console.error('خطأ في جلب التوصيلات:', err);
        return throwError(() => new Error('فشل في جلب التوصيلات'));
      })
    );
  }

  updateStatutCommande(id: number, statut: string): Observable<Commande> {
    return this.http
      .put<Commande>(`${this.apiUrl}/commandes/${id}/statut/${statut}`, {})
      .pipe(
        catchError((err) => {
          console.error('خطأ في تحديث حالة التوصيل:', err);
          return throwError(() => new Error('فشل في تحديث حالة التوصيل'));
        })
      );
  }

  getTopClients(page: number, size: number): Observable<Client[]> {
    return this.http
      .get<Client[]>(`${this.apiUrl}/dashboard/clients/top?page=${page}&size=${size}`)
      .pipe(
        catchError((err) => {
          console.error('خطأ في جلب أفضل العملاء:', err);
          return throwError(() => new Error('فشل في جلب أفضل العملاء'));
        })
      );
  }

  getRecentDeliveries(page: number, size: number): Observable<Commande[]> {
    return this.http
      .get<Commande[]>(`${this.apiUrl}/dashboard/commandes/recent?page=${page}&size=${size}`)
      .pipe(
        catchError((err) => {
          console.error('خطأ في جلب التوصيلات الأخيرة:', err);
          const errorMessage = err.error?.error || 'فشل في جلب التوصيلات الأخيرة. تحقق من الخادم.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getDeliveryStats(): Observable<DeliveryStats> {
    return this.http.get<DeliveryStats>(`${this.apiUrl}/dashboard/commandes/stats`).pipe(
      catchError((err) => {
        console.error('خطأ في جلب إحصائيات التوصيل:', err);
        return throwError(() => new Error('فشل في جلب إحصائيات التوصيل'));
      })
    );
  }

  getStatsCards(): Observable<StatsCard[]> {
    return this.http.get<StatsCard[]>(`${this.apiUrl}/dashboard/stats/cards`).pipe(
      catchError((err) => {
        console.error('خطأ في جلب بطاقات الإحصائيات:', err);
        return throwError(() => new Error('فشل في جلب بطاقات الإحصائيات'));
      })
    );
  }

  createOrder(orderData: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/orders`, orderData).pipe(
      catchError((err) => {
        console.error('خطأ في إنشاء الطلب:', err);
        return throwError(() => new Error('فشل في إنشاء الطلب'));
      })
    );
  }

  getCommandes(
    page: number = 0,
    size: number = 10,
    status: string = 'all',
    searchTerm: string = '',
    date: string = '',
    agent: string = 'all'
  ): Observable<CommandeResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status)
      .set('searchTerm', searchTerm)
      .set('date', date)
      .set('agent', agent);

    return this.http.get<CommandeResponse>(`${this.apiUrl}/orders`, { params }).pipe(
      catchError((err) => {
        console.error('خطأ في جلب الطلبات:', err);
        return throwError(() => new Error('فشل في جلب الطلبات'));
      })
    );
  }

  getDeliveryAgents(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(`${this.apiUrl}/delivery-agents`).pipe(
      catchError((err) => {
        console.error('خطأ في جلب وكلاء التوصيل:', err);
        return throwError(() => new Error('فشل في جلب وكلاء التوصيل'));
      })
    );
  }

  getFinancialSummary(): Observable<FinancialSummary> {
        return this.http.get<FinancialSummary>(`${this.apiUrl}/finance/summary`).pipe(
            catchError((err) => {
                console.error('خطأ في جلب البيانات المالية:', err);
                return throwError(() => new Error('فشل في جلب البيانات المالية'));
            })
        );
    }
  getDeliveryZones(): Observable<DeliveryZonesResponse> {
        return this.http.get<DeliveryZonesResponse>(`${this.apiUrl}/dashboard/delivery-zones`).pipe(
            catchError((err) => {
                console.error('خطأ في جلب مناطق التوصيل:', err);
                return throwError(() => new Error('فشل في جلب مناطق التوصيل'));
            })
        );
    }
}
interface DeliveryZone {
    city: string;
    postalCode: string;
    address: string;
    orderCount: number;
}
interface DeliveryZonesResponse {
    deliveryZones: DeliveryZone[];
    mostActiveZone: DeliveryZone;
}
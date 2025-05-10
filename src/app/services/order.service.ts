import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Order } from '../models/order.model';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getOrders(
    page: number,
    size: number,
    status: string,
    searchTerm: string,
    sortBy: string,
    sortDirection: string
  ): Observable<{ orders: Order[]; totalItems: number; totalPages: number; currentPage: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http
      .get<{ orders: Order[]; totalItems: number; totalPages: number; currentPage: number }>(
        `${this.apiUrl}/orders`,
        { params }
      )
      .pipe(
        tap(response => console.log('API Response:', response)),
        catchError(err => {
          console.error('API Error:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          return throwError(() => err);
        })
      );
  }


  getOrderById(id: number | string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
  
  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, orderData);
  }
  
  updateOrder(id: number | string, orderData: any): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, orderData);
  }
  
  deleteOrder(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  // Method for generating QR code (using your existing backend)
  generateQrCode(orderId: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}/qrcode`);
  }
}

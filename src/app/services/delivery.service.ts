// src/app/services/delivery.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Commande, CommandeResponse, DeliveryStats, StatsCard, CommandeSummary } from '../models/commande.model';
import { Client } from '../models/client.model';
import { FinancialSummary } from '../models/financial-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getRecentDeliveries(page: number, size: number): Observable<CommandeSummary[]> {
    return this.http.get<CommandeSummary[]>(
      `${this.apiUrl}/dashboard/commandes/recent?page=${page}&size=${size}` // Updated to match backend endpoint
    ).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des livraisons récentes:', err);
        return throwError(() => new Error('Échec de la récupération des livraisons récentes'));
      })
    );
  }

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
        console.error('Erreur lors de la récupération des livraisons:', err);
        return throwError(() => new Error('Échec de la récupération des livraisons'));
      })
    );
  }

  updateStatutCommande(id: number, statut: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/commandes/${id}/statut/${statut}`, {}).pipe(
      catchError((err) => {
        console.error('Erreur lors de la mise à jour du statut de la livraison:', err);
        return throwError(() => new Error('Échec de la mise à jour du statut de la livraison'));
      })
    );
  }

  getTopClients(page: number, size: number): Observable<Client[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Client[]>(`${this.apiUrl}/dashboard/clients/top`, { params }).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des meilleurs clients:', err);
        return throwError(() => new Error('Échec de la récupération des meilleurs clients'));
      })
    );
  }

  getDeliveryStats(): Observable<DeliveryStats> {
    return this.http.get<DeliveryStats>(`${this.apiUrl}/dashboard/commandes/stats`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des statistiques de livraison:', err);
        return throwError(() => new Error('Échec de la récupération des statistiques de livraison'));
      })
    );
  }

  getStatsCards(): Observable<StatsCard[]> {
    return this.http.get<StatsCard[]>(`${this.apiUrl}/dashboard/stats/cards`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des cartes de statistiques:', err);
        return throwError(() => new Error('Échec de la récupération des cartes de statistiques'));
      })
    );
  }

  createOrder(orderData: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/orders`, orderData).pipe(
      catchError((err) => {
        console.error('Erreur lors de la création de la commande:', err);
        return throwError(() => new Error('Échec de la création de la commande'));
      })
    );
  }

 getCommandes(
    page: number,
    size: number,
    status: string,
    searchTerm: string,
    date: string,
    agent: string
  ): Observable<CommandeResponse> {
    return this.http.get<CommandeResponse>(
      `${this.apiUrl}/orders?page=${page}&size=${size}&status=${status}&searchTerm=${searchTerm}&date=${date}&agent=${agent}`
    );
  }

  getDeliveryAgents(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(`${this.apiUrl}/delivery-agents`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des agents de livraison:', err);
        return throwError(() => new Error('Échec de la récupération des agents de livraison'));
      })
    );
  }

  getFinancialSummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.apiUrl}/finance/summary`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des données financières:', err);
        return throwError(() => new Error('Échec de la récupération des données financières'));
      })
    );
  }

  getDeliveryZones(): Observable<DeliveryZonesResponse> {
    return this.http.get<DeliveryZonesResponse>(`${this.apiUrl}/dashboard/delivery-zones`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des zones de livraison:', err);
        return throwError(() => new Error('Échec de la récupération des zones de livraison'));
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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AvisProduit } from '../models/avis.model';

@Injectable({
  providedIn: 'root',
})
export class AvisService {
  private apiUrl = 'http://localhost:8081/api/avisproduit';

  constructor(private http: HttpClient) {}

  createAvis(avis: AvisProduit): Observable<AvisProduit> {
    avis.date = new Date().toISOString(); // Ensure date is in ISO 8601 format
    return this.http.post<AvisProduit>(this.apiUrl, avis).pipe(
      catchError((err) => {
        console.error('Error creating avis:', err);
        return throwError(() => new Error('Failed to create avis'));
      })
    );
  }
}

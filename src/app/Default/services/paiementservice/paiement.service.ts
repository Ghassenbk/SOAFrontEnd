import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost:9090/paiements';

  constructor(private http: HttpClient) {}

  getPaiements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-detailed`);
  }
  deleteAllPaiements(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/all`);
  }
  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

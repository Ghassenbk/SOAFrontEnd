import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Avis {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status:number;
}
@Injectable({
  providedIn: 'root'
})
export class AvisService {
private apiUrl = `http://localhost:9090/avis`; // URL to backend

  constructor(private http: HttpClient) {}

  getAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.apiUrl);
  }
  deleteAvis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateStatus(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, {});
  }
  deleteAllAvis(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`);
  }
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/status`, {});
  }

}

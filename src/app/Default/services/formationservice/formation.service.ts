import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface formation{
  id:number;
  dateDebut:Date;
  dateFin:Date;
  description:String;
  prix:number;
  name:String;
}
@Injectable({
  providedIn: 'root'
})
export class FormationService {

 private apiUrl = `http://localhost:9090/formations`; // URL to backend

  constructor(private http: HttpClient) {}

  getFormation(): Observable<formation[]> {
    return this.http.get<formation[]>(this.apiUrl);
  }
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  addFormation(solution: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, solution);
  }
  updateFormation(formation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${formation.id}`, formation);
  }

}

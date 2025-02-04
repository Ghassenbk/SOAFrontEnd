import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Solution {
  id: number;
  name: string;
  description: string;
  devis: string;
  prix: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})

export class SolutionService {
  private apiUrl = `http://localhost:9090/solutions`; // URL to backend

  constructor(private http: HttpClient) {}

  getSolutions(): Observable<Solution[]> {
    return this.http.get<Solution[]>(this.apiUrl);
  }
  deleteSolution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  addSolution(solution: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, solution);
  }
  updateSolution(solution: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${solution.id}`,solution);
  }
  
}

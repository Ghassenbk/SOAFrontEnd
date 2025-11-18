import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:9090/company-info'; // Adjust the URL as per your Spring Boot API

  constructor(private http: HttpClient) { }

  // Get the company info
  getCompanyInfo(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Update the company info
  updateCompanyInfo(id: number, companyInfo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, companyInfo);
  }
}

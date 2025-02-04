import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:9090/avis';

  constructor(private http: HttpClient) {
   }
   sendMessage(contactForm: any): Observable<any> {
    return this.http.post(this.apiUrl, contactForm);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private api = 'http://localhost:9090/fournisseurs';
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<any[]>('http://localhost:9090/fournisseurs'); }
}
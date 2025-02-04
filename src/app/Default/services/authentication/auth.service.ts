import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:9090'; // Update with your backend URL
  private loggedInUser: { email: string; role: string; token: string } | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.loggedInUser = {
          email: response.email,
          role: response.role,
          token: response.token
        };
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      })
    );
  }

  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getUser(): { email: string; role: string; token: string } | null {
    if (!this.loggedInUser) {
      const user = localStorage.getItem('user');
      this.loggedInUser = user ? JSON.parse(user) : null;
    }
    return this.loggedInUser;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  isClient(): boolean {
    const user = this.getUser();
    return user?.role === 'client';
  }
}

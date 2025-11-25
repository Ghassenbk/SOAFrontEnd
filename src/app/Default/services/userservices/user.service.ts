import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  adresse: string;
  password: string;
  confirmPassword?: string;
}
@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:9090/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  deleteAllUsers(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}`);
  }

  loginUser(loginData: { email: string, password: string }) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:9090/users/login', loginData, { headers, withCredentials: true });

  }
  

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getUserFromLocalStorage() {
    // Check if there's a user in localStorage, if yes, return the user
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUserFromLocalStorage();
  }
  enrollUserInFormation(userId: number, formationId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/formations/${formationId}`, {});
  }
  addSolutionToCart(userId: number, solutionId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/panier/solutions/${solutionId}`, {});
  }

  getUserPanier(userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${userId}/panier`);
  }

  removeSolutionFromPanier(userId: number, solutionId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/panier/solutions/${solutionId}`);
  }

  getUserFormations(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/formations`);
  }

  removeFromFormation(userId: number, formationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/formations/${formationId}`);
  }
  
  




  


}

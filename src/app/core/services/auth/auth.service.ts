import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  readonly isLoggedIn$ = this.loggedIn.asObservable();

  private apiUrl = 'http://localhost:5000/api';

  private hasToken(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  public isLoggedIn(): boolean {
    return this.hasToken();
  }

  login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<{ access_token: string; user: { username: string } }>(
        `${this.apiUrl}/auth/login`,
        {
          username,
          password,
        }
      )
      .pipe(
        tap((response) => {
          sessionStorage.setItem('access_token', response.access_token);
          sessionStorage.setItem('username', response.user.username);
          this.loggedIn.next(true);
        }),
        catchError((error) => {
          this.logout();
          throw error;
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    this.loggedIn.next(false);
  }
  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }
  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }
}

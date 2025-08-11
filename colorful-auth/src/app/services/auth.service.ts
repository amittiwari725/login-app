import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageTokenKey = 'auth.token';
  private readonly storageUserKey = 'auth.user';

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(credentials: LoginCredentials): Observable<boolean> {
    const { email, password } = credentials;

    if (!email || !password) {
      return throwError(() => new Error('Email and password are required.'));
    }

    const isValid = email.includes('@') && password.length >= 6;

    return of(isValid).pipe(
      delay(900),
      tap((success) => {
        if (!success) {
          throw new Error('Invalid email or password');
        }
        const fakeToken = Math.random().toString(36).slice(2);
        localStorage.setItem(this.storageTokenKey, fakeToken);
        localStorage.setItem(this.storageUserKey, JSON.stringify({ email }));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(data: RegistrationData): Observable<boolean> {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return throwError(() => new Error('All fields are required.'));
    }

    const isValid = email.includes('@') && password.length >= 6 && name.trim().length >= 2;

    return of(isValid).pipe(
      delay(1200),
      tap((success) => {
        if (!success) {
          throw new Error('Invalid registration details');
        }
        const fakeToken = Math.random().toString(36).slice(2);
        localStorage.setItem(this.storageTokenKey, fakeToken);
        localStorage.setItem(this.storageUserKey, JSON.stringify({ name, email }));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageTokenKey);
    localStorage.removeItem(this.storageUserKey);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getUser(): { name?: string; email?: string } | null {
    const raw = localStorage.getItem(this.storageUserKey);
    return raw ? JSON.parse(raw) : null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.storageTokenKey);
  }
}
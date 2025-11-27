import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Options } from './data-manager-interface.d';
import { environment } from '@environments/environment';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {
  private backendURL = 'https://catalyst-main-1036749949194.asia-south2.run.app/';
  // private backendURL = environment.apiUrl;
  private store: Map<string, BehaviorSubject<any>> = new Map();

  isUserLoggedIn = signal<boolean>(false);

  jwtToken = localStorage.getItem('jwtToken') || '';
  cookie = localStorage.getItem('sessionCookie') || '';

  constructor(private http: HttpClient, private router: Router) {
  }

  /** -------- Fetch user credentials and store JWT token -------- */
  public checkLoggedInStatus(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.get('api/user', { withCredentials: true }).subscribe({
        next: (res: any) => {
          if (res.id) {
            this.isUserLoggedIn.set(true);
            this.getUserProfile();
          }
          resolve();
        },
        error: (err) => {
          if (err.status === 401 || err.status === 403) {
            this.isUserLoggedIn.set(false);
            resolve();
          }
          console.error('Error checking logged-in status:', err);
          reject(err);
        }
      });
    });
  }

  public login(email: any, password: any) {
    this.post('api/login', {
      "email": email,
      "password": password
    }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.jwtToken = res.jwt;
        this.cookie = `jwt=${this.jwtToken}; Path=/; HttpOnly;`;
        localStorage.setItem('jwtToken', res.jwt);
        localStorage.setItem('sessionCookie', this.cookie);
        this.isUserLoggedIn.set(true);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error fetching user credentials:', err);
      }
    });
  }
  /** -------- Fetch user profile and store in cache -------- */
  private getUserProfile() {
    this.get('api/user/profile', { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.set('userProfile', res);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  /** -------- GET with automatic caching and HTTP options -------- */
  get<T>(path: string, options?: Options): Observable<T> {
    const http$ = this.http.get<T>(this.backendURL + path, options);
    return this.saveInCache(path, http$);
  }

  /** -------- POST with optional caching via cacheKey -------- */
  post<T>(
    path: string,
    payload: any,
    options?: Options,
    cacheKey?: string
  ): Observable<T> {

    if (!options?.headers) {
      options = {
        ...options,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.jwtToken}`,
        })
      };
    }

    const http$ = this.http.post<T>(this.backendURL + path, payload, options);
    return cacheKey ? this.saveInCache(cacheKey, http$) : http$;
  }

  /** set value in cached Store */
  set<T>(key: string, value: T) {
    if (!this.store.has(key)) {
      this.store.set(key, new BehaviorSubject<T | null>(null));
    }
    this.store.get(key)!.next(value);
  }

  /** -------- Subscribe reactively to any store key -------- */
  select<T>(key: string): Observable<T | null> {
    if (!this.store.has(key)) {
      this.store.set(key, new BehaviorSubject<T | null>(null));
    }
    return this.store.get(key)!.asObservable();
  }

  /** -------- Get cached snapshot immediately -------- */
  snapshot<T>(key: string): T | null {
    return this.store.get(key)?.getValue() ?? null;
  }

  /** -------- Clear cached value for a key -------- */
  clear(key: string) {
    this.store.delete(key);
  }

  /** -------- Helper: tap observable and save result in cache -------- */
  private saveInCache<T>(key: string, observable$: Observable<T>): Observable<T> {
    if (!this.store.has(key)) {
      this.store.set(key, new BehaviorSubject<T | null>(null));
    }

    return observable$.pipe(
      tap(res => this.store.get(key)!.next(res)) // side effect: update store
    );
  }
}

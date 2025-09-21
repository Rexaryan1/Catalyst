import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {
  private backendURL = 'https://api.restful-api.dev/';
  private store: Map<string, BehaviorSubject<any>> = new Map();

  constructor(private http: HttpClient) {}

  /** -------- GET with automatic caching and HTTP options -------- */
  get<T>(path: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<T> {
    const http$ = this.http.get<T>(this.backendURL + path, options);
    return this.saveInCache(path, http$);
  }

  /** -------- POST with optional caching via cacheKey -------- */
  post<T>(
    path: string,
    payload: any,
    options?: { headers?: HttpHeaders; params?: HttpParams },
    cacheKey?: string
  ): Observable<T> {
    const http$ = this.http.post<T>(this.backendURL + path, payload, options);
    return cacheKey ? this.saveInCache(cacheKey, http$) : http$;
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

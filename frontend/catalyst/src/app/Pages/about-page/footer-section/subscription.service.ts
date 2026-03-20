import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type SubscribeResult =
  | { status: 'success' }
  | { status: 'already_subscribed' }
  | { status: 'error'; message: string };

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly endpoint =
    'https://api.catalystedutech.com/api/subscribe';

  constructor(private http: HttpClient) {}

  subscribe(email: string): Observable<SubscribeResult> {
    return this.http
      .post<{ message?: string }>(this.endpoint, { email })
      .pipe(
        map((): SubscribeResult => ({ status: 'success' })),
        catchError((err: HttpErrorResponse): Observable<SubscribeResult> => {
          if (
            err.status === 409 ||
            err.error?.message === 'Email already subscribed'
          ) {
            return of({ status: 'already_subscribed' });
          }
          return throwError(() => err);
        }),
      );
  }
}

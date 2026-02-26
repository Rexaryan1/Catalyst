import {HttpHeaders, HttpParams} from '@angular/common/http';

export interface Options {
  headers?: HttpHeaders;
  withCredentials?: boolean;

  params?: HttpParams;
}

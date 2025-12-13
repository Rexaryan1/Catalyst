import { HttpHeaders } from '@angular/common/http';

export interface Options {
  headers?: HttpHeaders;
  withCredentials?: boolean;
}
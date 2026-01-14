// push.service.ts
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PushService {

  constructor(
    private swPush: SwPush,
    private http: HttpClient
  ) {}

  subscribeToPush() {
    return this.http.get<any>('https://catalyst-main-1036749949194.asia-south2.run.app/api/vapid-public-key').subscribe(
      async (res) => {
        const sub = await this.swPush.requestSubscription({
          serverPublicKey: res.vapidPublicKey
        });

        this.http.post('https://catalyst-main-1036749949194.asia-south2.run.app/api/save-push-subscription', sub).subscribe();
      }
    );
  }
}

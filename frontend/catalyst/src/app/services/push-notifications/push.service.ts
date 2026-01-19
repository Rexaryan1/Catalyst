// push.service.ts
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { InAppNotificationsService } from '@services/notifications/in-app-notifications.service';

type IncomingPushPayload = {
  version?: number;
  type?: string;
  title?: string;
  body?: string;
};


@Injectable({ providedIn: 'root' })
export class PushService {
  private listening = false;
  private subscribing = false;
  private readonly subscribedFlagKey = 'pushSubscribed';

  constructor(
    private swPush: SwPush,
    private dataManager: DataManagerService,
    private inApp: InAppNotificationsService
  ) {}
  initIncomingPushListener() {
    if (this.listening) return;
    this.listening = true;

    this.swPush.messages.subscribe((payload: unknown) => {
      const p = payload as IncomingPushPayload;

      this.inApp.push({
        title: p?.title ?? 'Catalyst',
        body: p?.body ?? '',
        type: p?.type,
      });
    });
  }

  subscribeToPush() {
    // Don't try to subscribe if push isn't supported/enabled (e.g. dev mode without SW)
    if (!this.swPush.isEnabled) return;

    // Don't spam the subscription endpoint
    if (this.subscribing) return;

    // Persisted guard across refreshes
    if (localStorage.getItem(this.subscribedFlagKey) === '1') return;

    // Avoid prompting if the user already denied notifications
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return;

    this.subscribing = true;

    this.dataManager.get<{ vapidPublicKey: string }>('api/vapid-public-key').subscribe({
      next: async (res) => {
        try {
          const sub = await this.swPush.requestSubscription({
            serverPublicKey: res.vapidPublicKey,
          });

          this.dataManager
            .post('api/save-push-subscription', sub, { withCredentials: true })
            .subscribe({
              next: () => {
                localStorage.setItem(this.subscribedFlagKey, '1');
                this.subscribing = false;
              },
              error: (err) => {
                console.error('Failed to save push subscription:', err);
                this.subscribing = false;
              }
            });
        } catch (e) {
          // User dismissed the permission prompt or subscription failed
          this.subscribing = false;
        }
      },
      error: (err) => {
        console.error('Failed to get VAPID public key:', err);
        this.subscribing = false;
      },
    });
  }
}






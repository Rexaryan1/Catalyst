import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';

export type InAppNotification = {
  id: string;
  title: string;
  body: string;
  type?: string;
  createdAt: number;
};

@Injectable({ providedIn: 'root' })
export class InAppNotificationsService {
  private readonly storeKey = 'inAppNotifications';

  constructor(private dataManager: DataManagerService) {}

  items$(): Observable<InAppNotification[] | null> {
    return this.dataManager.select<InAppNotification[]>(this.storeKey);
  }

  snapshot(): InAppNotification[] {
    return this.dataManager.snapshot<InAppNotification[]>(this.storeKey) ?? [];
  }

  push(input: Omit<InAppNotification, 'id' | 'createdAt'>, ttlMs = 6000) {
    const item: InAppNotification = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...input,
    };

    this.dataManager.set<InAppNotification[]>(this.storeKey, [item, ...this.snapshot()]);

    window.setTimeout(() => this.dismiss(item.id), ttlMs);
  }

  dismiss(id: string) {
    this.dataManager.set<InAppNotification[]>(
      this.storeKey,
      this.snapshot().filter(n => n.id !== id)
    );
  }

  clear() {
    this.dataManager.set<InAppNotification[]>(this.storeKey, []);
  }
}

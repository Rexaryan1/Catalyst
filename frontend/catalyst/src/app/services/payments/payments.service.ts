import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';

export interface CreateSubscriptionResponse {
  razorpay_subscription_id: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  constructor(private dataManager: DataManagerService) {}

  createSubscription(planId: string): Observable<CreateSubscriptionResponse> {
    return this.dataManager.post<CreateSubscriptionResponse>(
      'api/payments/subscriptions',
      { plan_id: planId },
      { withCredentials: true },
    );
  }
}
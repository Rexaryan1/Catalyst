import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsService } from '@services/payments/payments.service';
import { environment } from '@environments/environment';

type Status = 'idle' | 'creating' | 'checkout' | 'success' | 'cancelled' | 'error';

// Only Plan row that exists right now (plan_Ti4zLpmH2eoC4z, "catalyst test", ₹400/mo).
// Hardcoded for this end-to-end test — replace with a plans-listing call once one exists.
const TEST_PLAN_ID = 'f1caf295-1805-4a18-8785-d4016ab846be';

declare const Razorpay: any;

@Component({
  selector: 'app-payment-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-preview.html',
  styleUrl: './payment-preview.scss',
})
export class PaymentPreviewComponent {
  status = signal<Status>('idle');
  log = signal<string[]>([]);

  private razorpayScriptLoaded = false;

  constructor(private paymentsService: PaymentsService) {}

  startTestSubscription(): void {
    this.status.set('creating');
    this.appendLog(`Creating subscription for plan_id=${TEST_PLAN_ID}...`);

    this.paymentsService.createSubscription(TEST_PLAN_ID).subscribe({
      next: (res) => {
        this.appendLog(`Backend returned razorpay_subscription_id=${res.razorpay_subscription_id}`);
        this.loadRazorpayScript()
          .then(() => this.openCheckout(res.razorpay_subscription_id))
          .catch((err) => {
            this.status.set('error');
            this.appendLog(`Failed to load Razorpay checkout script: ${err}`);
          });
      },
      error: (err) => {
        this.status.set('error');
        this.appendLog(`create_subscription failed: ${err.status ?? ''} ${JSON.stringify(err.error ?? err.message)}`);
      },
    });
  }

  private loadRazorpayScript(): Promise<void> {
    if (this.razorpayScriptLoaded || typeof Razorpay !== 'undefined') {
      this.razorpayScriptLoaded = true;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayScriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('script load error'));
      document.body.appendChild(script);
    });
  }

  private openCheckout(subscriptionId: string): void {
    this.status.set('checkout');
    this.appendLog('Opening Razorpay checkout (subscription mode)...');

    const rzp = new Razorpay({
      key: environment.razorpayKeyId,
      subscription_id: subscriptionId,
      name: 'Catalyst (test)',
      description: 'Test subscription — catalyst test plan',
      handler: (response: any) => {
        this.status.set('success');
        this.appendLog(`Checkout succeeded: payment_id=${response.razorpay_payment_id}, subscription_id=${response.razorpay_subscription_id}, signature=${response.razorpay_signature}`);
        this.appendLog('Note: entitlement status is confirmed server-side via webhook, not here — check backend logs for subscription.activated.');
      },
      modal: {
        ondismiss: () => {
          this.status.set('cancelled');
          this.appendLog('Checkout dismissed by user before completing payment.');
        },
      },
    });

    rzp.open();
  }

  private appendLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.log.update((lines) => [...lines, `[${timestamp}] ${message}`]);
  }
}
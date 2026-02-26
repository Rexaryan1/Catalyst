import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  createComponent,
  inject,
  Type
} from '@angular/core';

export interface OverlayConfig {
  /** Component inputs to set */
  inputs?: Record<string, any>;
  /** Unique ID for this overlay (auto-generated if not provided) */
  id?: string;
  /** Show close button in top-right (default: true) */
  showCloseButton?: boolean;
  /** Close on ESC key press (default: true) */
  closeOnEscape?: boolean;
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean;
  /** Custom overlay background (default: 'rgba(0, 0, 0, 0.5)') */
  backdropColor?: string;
  /** Custom modal max-width (default: '1400px') */
  maxWidth?: string;
  /** Callback when overlay closes */
  onClose?: () => void;
  data?: any; // Optional data to pass to the component
}

@Injectable({
  providedIn: 'root'
})
export class DisplayManagerService {
  private appRef = inject(ApplicationRef);
  private env = inject(EnvironmentInjector);
  private activeOverlays: Map<string, ComponentRef<any>> = new Map();
  private overlayCounter = 0;

  /**
   * Display any component as an overlay popup
   * @param component - The component class to display
   * @param config - Configuration options
   * @returns The overlay ID
   * 
   * @example
   * // Simple usage
   * this.overlayService.open(MyComponent);
   * 
   * @example
   * // With inputs and config
   * this.overlayService.open(MyComponent, {
   *   inputs: { data: myData, title: 'Hello' },
   *   closeOnBackdrop: false
   * });
   */
  open<T>(component: Type<T>, config: OverlayConfig = {}): string {
    // Generate or use provided overlay ID
    const overlayId = config.id || `overlay-${++this.overlayCounter}`;

    // Create overlay container
    const overlay = this.createOverlay(overlayId, config);

    // Create component instance
    const componentRef = this.createComponent(component, config.inputs);

    // Create modal wrapper
    const modalWrapper = this.createModalWrapper(config);

    // Append component to modal
    modalWrapper.appendChild((componentRef.hostView as any).rootNodes[0]);

    // Append modal to overlay
    overlay.appendChild(modalWrapper);

    // Store reference
    this.activeOverlays.set(overlayId, componentRef);

    // Setup close handlers
    this.setupCloseHandlers(overlay, modalWrapper, componentRef, overlayId, config);

    return overlayId;
  }

  /**
   * Close a specific overlay by ID
   * @param overlayId - ID of the overlay to close
   */
  close(overlayId: string): void {
    const overlay = document.getElementById(overlayId);
    const componentRef = this.activeOverlays.get(overlayId);

    if (overlay) {
      // Add fade out animation
      overlay.classList.add('fade-out');

      setTimeout(() => {
        overlay.remove();
        // Restore body scroll if no more overlays
        if (this.activeOverlays.size === 1) {
          document.body.style.overflow = '';
        }
      }, 300); // Match CSS animation duration
    }

    if (componentRef) {
      // Call onClose callback if provided
      const config = (componentRef as any).__overlayConfig as OverlayConfig;
      if (config?.onClose) {
        config.onClose();
      }

      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      this.activeOverlays.delete(overlayId);
    }
  }

  /**
   * Close all active overlays
   */
  closeAll(): void {
    const overlayIds = Array.from(this.activeOverlays.keys());
    overlayIds.forEach(id => this.close(id));
  }

  /**
   * Get the component reference for an overlay
   * @param overlayId - ID of the overlay
   * @returns Component reference or undefined
   */
  getComponentRef<T>(overlayId: string): ComponentRef<T> | undefined {
    return this.activeOverlays.get(overlayId);
  }

  /**
   * Check if an overlay is currently open
   * @param overlayId - ID of the overlay
   */
  isOpen(overlayId: string): boolean {
    return this.activeOverlays.has(overlayId);
  }

  /**
   * Get count of active overlays
   */
  getActiveCount(): number {
    return this.activeOverlays.size;
  }

  private createOverlay(overlayId: string, config: OverlayConfig): HTMLElement {
    // Remove existing overlay if present
    const existing = document.getElementById(overlayId);
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.className = 'generic-overlay';

    // Apply custom backdrop color if provided
    if (config.backdropColor) {
      overlay.style.background = config.backdropColor;
    }

    document.body.appendChild(overlay);

    // Add styles if not already present
    this.injectOverlayStyles();

    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';

    return overlay;
  }

  private createModalWrapper(config: OverlayConfig): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'generic-modal-wrapper';

    // Apply custom max-width if provided
    if (config.maxWidth) {
      wrapper.style.maxWidth = config.maxWidth;
    }

    // Add close button if enabled (default: true)
    if (config.showCloseButton !== false) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'generic-close-btn';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      wrapper.appendChild(closeBtn);
    }

    return wrapper;
  }

  private createComponent<T>(component: Type<T>, inputs?: Record<string, any>): ComponentRef<T> {
    // Create component
    const componentRef = createComponent(component, {
      environmentInjector: this.env
    });

    // Set inputs if provided
    if (inputs) {
      Object.keys(inputs).forEach(key => {
        componentRef.setInput(key, inputs[key]);
      });
    }

    // Attach to Angular's change detection
    this.appRef.attachView(componentRef.hostView);

    // Trigger change detection
    componentRef.changeDetectorRef.detectChanges();

    return componentRef;
  }

  private setupCloseHandlers(
    overlay: HTMLElement,
    modalWrapper: HTMLElement,
    componentRef: ComponentRef<any>,
    overlayId: string,
    config: OverlayConfig
  ): void {
    // Store config on component ref for later access
    (componentRef as any).__overlayConfig = config;

    // Close on overlay background click (if enabled)
    if (config.closeOnBackdrop !== false) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close(overlayId);
        }
      });
    }

    // Close on close button click (if button exists)
    const closeBtn = modalWrapper.querySelector('.generic-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close(overlayId);
      });
    }

    // Close on Escape key (if enabled)
    if (config.closeOnEscape !== false) {
      const escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          this.close(overlayId);
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
  }

  private injectOverlayStyles(): void {
    // Check if styles already injected
    if (document.getElementById('generic-overlay-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'generic-overlay-styles';
    style.textContent = `
      .generic-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease-out;
        overflow-y: auto;
      }

      .generic-overlay.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
      }

      .generic-modal-wrapper {
        position: relative;
        max-width: 1400px;
        width: 100%;
        max-height: 90vh;
        background: transparent;
        border-radius: 20px;
        animation: slideUp 0.3s ease-out;
        overflow: hidden;
      }

      .generic-close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2D3748;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }

      .generic-close-btn:hover {
        background: white;
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .generic-close-btn:active {
        transform: scale(0.95);
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .generic-overlay {
          padding: 10px;
        }

        .generic-modal-wrapper {
          max-height: 95vh;
        }

        .generic-close-btn {
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          font-size: 24px;
        }
      }
    `;

    document.head.appendChild(style);
  }
}
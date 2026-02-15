/**
 * PWA-related type definitions
 */

/**
 * BeforeInstallPromptEvent - fired when the browser is ready to show the install prompt
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Service Worker registration state
 */
export interface SWRegistrationState {
  isSupported: boolean;
  isRegistered: boolean;
  isReady: boolean;
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
}

/**
 * PWA Display Mode
 */
export type PWADisplayMode = "browser" | "standalone" | "minimal-ui" | "fullscreen";

/**
 * Network status
 */
export interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  downlink?: number;
  rtt?: number;
}

/**
 * Extend the Window interface for PWA events
 */
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

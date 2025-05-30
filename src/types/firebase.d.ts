// src/types/firebase.d.ts
import { AnalyticsCallOptions } from 'firebase/analytics';

declare module 'firebase/analytics' {
  interface CustomEventParameters {
    screen_name: string;
    screen_class?: string;
  }

  export function logEvent(
    analyticsInstance: Analytics,
    eventName: 'screen_view',
    eventParams: {
      screen_name: string;
      screen_class?: string;
      [key: string]: any;
    },
    options?: AnalyticsCallOptions
  ): void;

  export function logEvent(
    analyticsInstance: Analytics,
    eventName: 'app_launched',
    eventParams?: { [key: string]: any },
    options?: AnalyticsCallOptions
  ): void;
}
// types/event-source-polyfill.d.ts
declare module 'event-source-polyfill' {
  interface EventSourceInit {
    headers?: Record<string, string>;
    proxy?: string;
    https?: object;
    withCredentials?: boolean;
    /** 💡 자동 재연결 대기 시간 (기본: 45초) */
    heartbeatTimeout?: number;
  }

  export class EventSourcePolyfill {
    constructor(url: string, eventSourceInitDict?: EventSourceInit);
    close(): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
    onopen: ((this: EventSource, ev: Event) => any) | null;
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
    onerror: ((this: EventSource, ev: Event) => any) | null;
    readyState: number;
    url: string;
    withCredentials: boolean;
  }
}

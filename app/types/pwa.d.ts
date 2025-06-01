/* 전역 선언이므로 export 하지 않습니다 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

/* 기존 윈도 이벤트 맵을 확장 */
export interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
  appinstalled: Event;
}

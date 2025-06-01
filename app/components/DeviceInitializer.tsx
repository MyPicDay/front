'use client';

import { useEffect } from 'react';
import generateUUID from '../utils/uuidGenerator';

export default function DeviceInitializer() {
  useEffect(() => {
    // deviceId 생성해서 localStorage에 저장
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = generateUUID(); // 브라우저 지원
      localStorage.setItem('deviceId', deviceId);
      console.log('새 deviceId 생성:', deviceId);
    } else {
      console.log('기존 deviceId:', deviceId);
    }
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
} 
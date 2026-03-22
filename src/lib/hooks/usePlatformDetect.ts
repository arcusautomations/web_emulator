'use client';

import { useState } from 'react';

interface PlatformInfo {
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isTouchDevice: boolean;
  isSafari: boolean;
}

const SSR_DEFAULTS: PlatformInfo = {
  isMobile: false,
  isDesktop: true,
  isTablet: false,
  isIOS: false,
  isAndroid: false,
  isTouchDevice: false,
  isSafari: false,
};

function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined') return SSR_DEFAULTS;

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isTablet = isTouchDevice && Math.min(window.innerWidth, window.innerHeight) >= 600;
  const isMobile = isTouchDevice && !isTablet;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  return {
    isMobile,
    isDesktop: !isTouchDevice,
    isTablet,
    isIOS,
    isAndroid,
    isTouchDevice,
    isSafari,
  };
}

export function usePlatformDetect(): PlatformInfo {
  const [platform] = useState<PlatformInfo>(detectPlatform);
  return platform;
}

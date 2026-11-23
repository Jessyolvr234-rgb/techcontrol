"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    pwaInstallPrompt?: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaManager() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // The app remains usable if service worker registration is unavailable.
      }
    };

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.pwaInstallPrompt = event as BeforeInstallPromptEvent;
      window.dispatchEvent(new Event("techcontrol-pwa-ready"));
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    void register();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  return null;
}

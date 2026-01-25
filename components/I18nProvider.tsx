"use client";

import { useEffect } from 'react';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem('prefLanguage');
    if (stored && ['en', 'fr'].includes(stored)) {
      i18n.changeLanguage(stored);
    }
  }, []);

  return <>{children}</>;
}
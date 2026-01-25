'use client';

import { useEffect } from 'react';

export default function CleanAttributes() {
  useEffect(() => {
    const keys = ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
    for (const k of keys) {
      if (document.documentElement && document.documentElement.hasAttribute(k)) {
        document.documentElement.removeAttribute(k);
      }
      if (document.body && document.body.hasAttribute(k)) {
        document.body.removeAttribute(k);
      }
    }
  }, []);

  return null;
}
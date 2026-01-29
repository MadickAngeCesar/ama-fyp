// Provide a minimal JSX namespace for third-party packages that reference
// `JSX.IntrinsicElements` (works around packages that ship TS source).
// This file is intentionally permissive to avoid blocking build due to
// missing JSX global types in node_modules.
import type * as React from 'react';

declare global {
  // Provide a permissive IntrinsicElements mapping so third-party
  // TypeScript sources that reference `JSX.IntrinsicElements` compile.
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  count: number;
  active?: boolean;
  // onToggle may perform async work
  onToggle?: () => void | Promise<void>;
};

/**
 * Thin wrapper around shadcn `Button` used for upvote controls.
 */
export default function UpvoteButton({ count, active, onToggle }: Props) {
  const [loading, setLoading] = useState(false);

  function isPromise<T = unknown>(p: unknown): p is Promise<T> {
    return Boolean(p && typeof (p as { then?: unknown }).then === "function");
  }

  const handleClick = async () => {
    if (!onToggle) return;
    try {
      const res = onToggle();
      if (isPromise(res)) {
        setLoading(true);
        await res;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant={active ? "secondary" : "outline"} size="sm" onClick={handleClick} loading={loading}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <path d="M14 9V5a3 3 0 0 0-3-3L7 6v7h9a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4z"></path>
        <path d="M7 22a3 3 0 0 0 3-3v-9"></path>
      </svg>
      {count}
    </Button>
  );
}

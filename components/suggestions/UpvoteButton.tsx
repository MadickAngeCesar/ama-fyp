"use client";
import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  count: number;
  active?: boolean;
  onToggle?: () => void;
};

/**
 * Thin wrapper around shadcn `Button` used for upvote controls.
 */
export default function UpvoteButton({ count, active, onToggle }: Props) {
  return (
    <Button variant={active ? "secondary" : "outline"} size="sm" onClick={onToggle}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <path d="M14 9V5a3 3 0 0 0-3-3L7 6v7h9a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4z"></path>
        <path d="M7 22a3 3 0 0 0 3-3v-9"></path>
      </svg>
      {count}
    </Button>
  );
}

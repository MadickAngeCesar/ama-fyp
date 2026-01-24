"use client";
import React from "react";
import { Suggestion } from "./types";
import SuggestionCard from "./SuggestionCard";

type Props = {
  suggestions: Suggestion[];
  onUpvote?: (id: string) => void;
};

/**
 * Renders a responsive list of suggestions.
 */
export default function SuggestionList({ suggestions, onUpvote }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return <div className="text-sm text-muted-foreground">No suggestions yet.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {suggestions.map((s) => (
        <SuggestionCard key={s.id} suggestion={s} onUpvote={onUpvote} />
      ))}
    </div>
  );
}

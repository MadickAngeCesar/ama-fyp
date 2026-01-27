"use client";
import React from "react";
import { Suggestion } from "./types";
import SuggestionCard from "./SuggestionCard";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  suggestions: Suggestion[];
  onUpvote?: (id: string) => void;
  loading?: boolean;
};

/**
 * Renders a responsive list of suggestions.
 */
export default function SuggestionList({ suggestions, onUpvote, loading }: Props) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return <div className="text-sm text-muted-foreground">{t('suggestions.noSuggestions')}</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {suggestions.map((s) => (
        <SuggestionCard key={s.id} suggestion={s} onUpvote={onUpvote} />
      ))}
    </div>
  );
}

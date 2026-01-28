"use client";
import React from "react";
import { Suggestion } from "./types";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  suggestion: Suggestion;
  onUpvote?: (id: string) => void;
};

/**
 * Card that represents a single suggestion using shadcn Card.
 */
export default function SuggestionCard({ suggestion, onUpvote }: Props) {
  const { t, i18n } = useTranslation()
  const handleUpvote = () => onUpvote?.(suggestion.id);

  return (
    <Card className="hover:shadow-md transition-shadow p-3">
      <CardHeader className="items-start gap-3 py-0">
        <div className="flex-1">
          <CardTitle className="text-sm">{suggestion.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-1">{suggestion.description}</CardDescription>
        </div>
      </CardHeader>

      <CardFooter className="px-0 py-2">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">
            <span>{t('suggestions.by', { author: suggestion.authorName ?? t('sidebar.student') })}</span>
            <span className="mx-2">•</span>
            <span>{new Date(suggestion.createdAt).toLocaleDateString(i18n.language)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleUpvote}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M14 9V5a3 3 0 0 0-3-3L7 6v7h9a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4z"></path>
                <path d="M7 22a3 3 0 0 0 3-3v-9"></path>
              </svg>
              {Number(suggestion.upvotes) || 0}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

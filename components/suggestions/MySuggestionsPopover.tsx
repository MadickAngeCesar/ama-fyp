"use client";
import React from "react";
import { Suggestion as UIType } from "./types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  suggestions: UIType[];
  onOpen?: (id: string) => void;
};

/**
 * Content for listing current user's suggestions, now for Dialog.
 */
export default function MySuggestionsContent({ suggestions, onOpen }: Props) {
  const { t, i18n } = useTranslation()
  if (!suggestions || suggestions.length === 0) {
    return <div className="p-4">{t('suggestions.noUserSuggestions')}</div>;
  }

  return (
    <div className="space-y-2">
      {suggestions.map((s) => (
        <Card key={s.id} className="p-2">
          <CardContent className="p-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm">{s.title}</CardTitle>
                <div className="text-xs text-muted-foreground line-clamp-2">{s.description}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString(i18n.language)}</div>
                <Button size="sm" variant="ghost" onClick={() => onOpen?.(s.id)}>{t('complaints.open')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

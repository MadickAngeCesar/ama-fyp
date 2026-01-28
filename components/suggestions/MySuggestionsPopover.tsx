"use client";
import React from "react";
import { Suggestion as UIType } from "./types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type Props = {
  suggestions: UIType[];
};

/**
 * Content for listing current user's suggestions, now for Dialog.
 */
export default function MySuggestionsContent({ suggestions }: Props) {
  const { t, i18n } = useTranslation()
  if (!suggestions || suggestions.length === 0) {
    return <div className="p-4">{t('suggestions.noUserSuggestions')}</div>;
  }

  return (
    <div className="h-screen max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="space-y-2 p-2">
        {suggestions.map((s) => (
          <Card key={s.id} className="p-2">
            <CardContent className="p-2">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <CardTitle className="text-sm">{s.title}</CardTitle>
                  <div className="text-xs text-muted-foreground line-clamp-2">{s.description}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(s.createdAt).toLocaleDateString(i18n.language)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

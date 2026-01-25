"use client";
import React from "react";
import { Suggestion as UIType } from "./types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  suggestions: UIType[];
  onOpen?: (id: string) => void;
};

/**
 * Content for listing current user's suggestions, now for Dialog.
 */
export default function MySuggestionsContent({ suggestions, onOpen }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return <div className="p-4">You have not submitted any suggestions yet.</div>;
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
                <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</div>
                <Button size="sm" variant="ghost" onClick={() => onOpen?.(s.id)}>Open</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

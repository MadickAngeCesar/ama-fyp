"use client";
import React from "react";
import { Suggestion as UIType } from "./types";
import { PopoverContent } from "@/components/ui/popover";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  suggestions: UIType[];
  onOpen?: (id: string) => void;
};

/**
 * Popover content listing current user's suggestions.
 */
export default function MySuggestionsPopover({ suggestions, onOpen }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <PopoverContent className="w-[320px]">
        <div className="p-4">You have not submitted any suggestions yet.</div>
      </PopoverContent>
    );
  }

  return (
    <PopoverContent className="w-[min(480px,90vw)]">
      <div className="p-2 space-y-2">
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
    </PopoverContent>
  );
}

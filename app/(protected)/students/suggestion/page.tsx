"use client";
import React, { useMemo, useState } from "react";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import SuggestionList from "@/components/suggestions/SuggestionList";
import { Suggestion } from "@/components/suggestions/types";
import { suggestions as placeholderSuggestions, users as placeholderUsers } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import MySuggestionsPopover from "@/components/suggestions/MySuggestionsPopover";

export default function Page() {
  const initial = (placeholderSuggestions || []).map((s) => {
    const user = (placeholderUsers || []).find((u) => u.id === s.userId);
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      authorName: user?.name,
      upvotes: s.upvotes ?? 0,
      createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
    } as Suggestion;
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>(initial);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");

  const handleSubmit = (payload: Omit<Suggestion, "id" | "createdAt" | "upvotes">) => {
    const newOne: Suggestion = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      ...payload,
    };
    setSuggestions((s) => [newOne, ...s]);
  };

  const handleUpvote = (id: string) => {
    setSuggestions((list) =>
      list.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s))
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = suggestions.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    if (sort === "top") out = out.sort((a, b) => b.upvotes - a.upvotes);
    else out = out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return out;
  }, [suggestions, query, sort]);

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Suggestions</h1>
          <p className="text-sm text-muted-foreground">Share ideas, vote on improvements, and see what&apos;s being considered.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="ghost">Help</Button>
          <Button>Contact staff</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="items-center justify-center">Actions & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="lg" className="w-full">Add suggestion</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[min(640px,90vw)]">
                    <PopoverHeader>
                      <PopoverTitle className="text-lg">Share an idea</PopoverTitle>
                    </PopoverHeader>
                    <div className="mt-2">
                      <SuggestionForm onSubmit={(p) => { handleSubmit(p); }} />
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full">My suggestions</Button>
                  </PopoverTrigger>
                  {/* Determine current user (student) from placeholderUsers and pass their suggestions */}
                  <MySuggestionsPopover
                    suggestions={(placeholderSuggestions || [])
                      .filter((ps) => ps.userId === (placeholderUsers || [])[0]?.id)
                      .map((s) => ({
                        id: s.id,
                        title: s.title,
                        description: s.description,
                        authorName: (placeholderUsers || []).find((u) => u.id === s.userId)?.name,
                        upvotes: s.upvotes ?? 0,
                        createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
                      }))}
                    onOpen={(id) => {
                      // bring selected suggestion to top for demo
                      setSuggestions((list) => {
                        const idx = list.findIndex((x) => x.id === id);
                        if (idx === -1) return list;
                        const copy = [...list];
                        const [sel] = copy.splice(idx, 1);
                        return [sel, ...copy];
                      });
                    }}
                  />
                </Popover>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <Input className="h-12 text-base" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suggestions" />
            </div>
            <div className="flex gap-2">
              <Button size="lg" variant={sort === "new" ? "secondary" : "outline"} onClick={() => setSort("new")}>Newest</Button>
              <Button size="lg" variant={sort === "top" ? "secondary" : "outline"} onClick={() => setSort("top")}>Top</Button>
            </div>
          </div>

          <SuggestionList suggestions={filtered} onUpvote={handleUpvote} />
        </main>
      </div>
    </div>
  );
}
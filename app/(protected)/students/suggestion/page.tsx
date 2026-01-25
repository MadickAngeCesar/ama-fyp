"use client";
import React, { useMemo, useState } from "react";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import SuggestionList from "@/components/suggestions/SuggestionList";
import { Suggestion } from "@/components/suggestions/types";
import { suggestions as placeholderSuggestions, users as placeholderUsers } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MySuggestionsContent from "@/components/suggestions/MySuggestionsPopover";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation()

  // Ensure initial suggestions are static/serialized to avoid hydration mismatch
  const initial = useMemo(() => {
    return (placeholderSuggestions || []).map((s) => {
      const user = (placeholderUsers || []).find((u) => u.id === s.userId);
      return {
        id: String(s.id),
        title: s.title,
        description: s.description,
        authorName: user?.name,
        upvotes: s.upvotes ?? 0,
        createdAt:
          typeof s.createdAt === "string"
            ? s.createdAt
            : s.createdAt instanceof Date
            ? s.createdAt.toISOString()
            : String(s.createdAt),
      } as Suggestion;
    });
  }, []);

  const [suggestions, setSuggestions] = useState<Suggestion[]>(initial);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");

  const handleSubmit = (payload: Omit<Suggestion, "id" | "createdAt" | "upvotes">) => {
    // Only generate new Date/id on client event
    const now = new Date();
    const newOne: Suggestion = {
      id: now.getTime().toString(),
      createdAt: now.toISOString(),
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
          <h1 className="text-3xl font-bold">{t('suggestions.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('suggestions.intro')}</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="ghost">{t('complaints.help')}</Button>
          <Button>{t('complaints.contactStaff')}</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="items-center justify-center ">{t('suggestions.actionsFilters')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">{t('suggestions.addSuggestion')}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg">{t('suggestions.shareIdea')}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <SuggestionForm onSubmit={(p) => { handleSubmit(p); }} />
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full">{t('suggestions.mySuggestions')}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t('suggestions.mySuggestionsTitle')}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <MySuggestionsContent
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
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <Input className="h-12 text-base" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('suggestions.search')} />
            </div>
            <div className="flex gap-2">
              <Button size="lg" variant={sort === "new" ? "secondary" : "outline"} onClick={() => setSort("new")}>{t('suggestions.newest')}</Button>
              <Button size="lg" variant={sort === "top" ? "secondary" : "outline"} onClick={() => setSort("top")}>{t('suggestions.top')}</Button>
            </div>
          </div>

          <SuggestionList suggestions={filtered} onUpvote={handleUpvote} />
        </main>
      </div>
    </div>
  );
}
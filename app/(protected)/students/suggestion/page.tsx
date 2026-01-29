"use client";
import React, { useMemo, useState, useEffect } from "react";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import SuggestionList from "@/components/suggestions/SuggestionList";
import { Suggestion } from "@/components/suggestions/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MySuggestionsContent from "@/components/suggestions/MySuggestionsPopover";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Link from "next/link";

export default function Page() {
  const { t } = useTranslation()

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/suggestions');
        if (response.ok) {
          const data = await response.json();
          // Ensure upvotes is a number
          const formattedData = (data as Suggestion[]).map((s) => ({
            ...s,
            upvotes: Number(s.upvotes) || 0,
          }));
          setSuggestions(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSubmit = async (payload: Omit<Suggestion, "id" | "createdAt" | "upvotes">) => {
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newSuggestion = await response.json();
        setSuggestions((s) => [newSuggestion, ...s]);
      }
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const response = await fetch(`/api/suggestions/${id}/upvote`, {
        method: 'POST',
      });

      if (response.ok) {
        const { upvoted } = await response.json();
        setSuggestions((list) =>
          list.map((s) =>
            s.id === id
              ? {
                  ...s,
                  upvotes: upvoted ? Number(s.upvotes) + 1 : Number(s.upvotes) - 1,
                  userUpvoted: upvoted,
                }
              : s
          )
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to upvote suggestion');
      }
    } catch (error) {
      console.error('Failed to upvote suggestion:', error);
      toast.error('Failed to upvote suggestion. Please try again.');
    }
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
          <Button asChild>
            <Link href="/students/chat">{t("complaints.help")}</Link>
          </Button>
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
                        suggestions={suggestions}
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

          <SuggestionList suggestions={filtered} onUpvote={handleUpvote} loading={loading} />
        </main>
      </div>
    </div>
  );
}
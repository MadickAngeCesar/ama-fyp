"use client";
import React, { useMemo, useState, useEffect } from "react";
import StaffSuggestionTable from "@/components/suggestions/StaffSuggestionTable";
import { Suggestion } from "@/components/suggestions/types";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Lightbulb, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/suggestions');
        if (response.ok) {
          const data = await response.json();
          // Map API response to component format
          const formatted = data.map((s: any) => ({
            ...s,
            status: s.status || "pending",
            category: "General", // Default category since not in schema
            responses: [], // Not in current schema
          }));
          setSuggestions(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleUpdateSuggestion = async (id: string, updates: Partial<Suggestion>) => {
    try {
      // For status updates, use the action API
      if (updates.status) {
        const response = await fetch(`/api/suggestions/${id}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_status',
            status: updates.status,
          }),
        });

        if (response.ok) {
          setSuggestions((list) =>
            list.map((s) => (s.id === id ? { ...s, ...updates } : s))
          );
        }
      } else {
        // For other updates, use PUT
        const response = await fetch(`/api/suggestions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          setSuggestions((list) =>
            list.map((s) => (s.id === id ? { ...s, ...updates } : s))
          );
        }
      }
    } catch (error) {
      console.error('Failed to update suggestion:', error);
    }
  };

  const filtered = useMemo(() => {
    const out = suggestions.filter((s) => {
      const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) ||
                           s.description.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
    const sorted = [...out];
    if (sortBy === "votes") {
      sorted.sort((a, b) => sortOrder === "asc" ? a.upvotes - b.upvotes : b.upvotes - a.upvotes);
    } else if (sortBy === "date") {
      sorted.sort((a, b) => sortOrder === "asc" 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [suggestions, query, statusFilter, categoryFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = suggestions.length;
    const pending = suggestions.filter(s => s.status === 'pending').length;
    const inProgress = suggestions.filter(s => s.status === 'in_progress').length;
    const resolved = suggestions.filter(s => s.status === 'resolved').length;
    const closed = suggestions.filter(s => s.status === 'closed').length;
    return { total, pending, inProgress, resolved, closed };
  }, [suggestions]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('staff.suggestions.manage')}</h1>
            <p className="text-sm text-muted-foreground">{t('staff.suggestions.review')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          {t('staff.suggestions.export')}
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('staff.suggestions.total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-lg font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">{t('staff.suggestions.pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-lg font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">{t('staff.suggestions.inProgress')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-lg font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">{t('staff.suggestions.resolved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-lg font-bold">{stats.closed}</p>
                <p className="text-xs text-muted-foreground">{t('staff.suggestions.closed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1">
          <Card className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                {t('staff.suggestions.filters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1">
                  <Search className="h-3 w-3" />
                  {t('staff.suggestions.search')}
                </label>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('staff.suggestions.searchSuggestions')}
                />
              </div>
              <div className="flex flex-row justify-between">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.suggestions.status')}</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('staff.suggestions.all')}</SelectItem>
                      <SelectItem value="pending">{t('staff.suggestions.pending')}</SelectItem>
                      <SelectItem value="in_progress">{t('staff.suggestions.inProgress')}</SelectItem>
                      <SelectItem value="resolved">{t('staff.suggestions.resolved')}</SelectItem>
                      <SelectItem value="closed">{t('staff.suggestions.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.suggestions.category')}</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('staff.suggestions.all')}</SelectItem>
                      <SelectItem value="General">{t('staff.suggestions.general')}</SelectItem>
                      <SelectItem value="Facilities">{t('staff.suggestions.facilities')}</SelectItem>
                      <SelectItem value="IT">{t('staff.suggestions.it')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.suggestions.sortBy')}</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('staff.suggestions.none')}</SelectItem>
                      <SelectItem value="votes">{t('staff.suggestions.votes')}</SelectItem>
                      <SelectItem value="date">{t('staff.suggestions.date')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Sort Order */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.suggestions.order')}</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">{t('staff.suggestions.asc')}</SelectItem>
                      <SelectItem value="desc">{t('staff.suggestions.desc')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSortBy("none");
                setSortOrder("desc");
              }}>
                {t('staff.suggestions.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <StaffSuggestionTable suggestions={filtered} onUpdateSuggestion={handleUpdateSuggestion} />
        </main>
      </div>
    </div>
  );
}
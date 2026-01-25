"use client";
import React, { useMemo, useState } from "react";
import { complaints as placeholderComplaints, users as placeholderUsers } from "@/lib/placeholder-data";
import { Complaint } from "@/components/complaints/types";
import StaffComplaintTable from "@/components/complaints/StaffComplaintTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Clock, Filter, Search, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Staff complaint management page.
 * Allows staff to view, filter, sort, and manage complaints.
 */
export default function Page() {
  const { t } = useTranslation();
  // Ensure initial complaints are static/serialized to avoid hydration mismatch
  const initial = useMemo(() => {
    return (placeholderComplaints || []).map((c) => {
      const user = (placeholderUsers || []).find((u) => u.id === c.userId);
      return {
        id: String(c.id),
        category: c.category,
        description: c.description,
        status: c.status,
        reporterName: user?.name,
        assigneeName: null,
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
        responses: [],
      } as Complaint;
    });
  }, []);

  const [complaints, setComplaints] = useState<Complaint[]>(initial);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const handleUpdateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints((list) =>
      list.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const filtered = useMemo(() => {
    const out = complaints.filter((c) => {
      const matchesQuery = c.description.toLowerCase().includes(query.toLowerCase()) ||
                           (c.reporterName || "").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
    const sorted = [...out];
    if (sortBy === "date") {
      sorted.sort((a, b) => sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [complaints, query, statusFilter, categoryFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'PENDING').length;
    const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const closed = complaints.filter(c => c.status === 'CLOSED').length;
    return { total, pending, inProgress, resolved, closed };
  }, [complaints]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('staff.complaints.manage')}</h1>
            <p className="text-sm text-muted-foreground">{t('staff.complaints.review')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          {t('staff.complaints.export')}
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.total')}</p>
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
                <p className="text-xs text-muted-foreground">{t('staff.complaints.pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-lg font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.inProgress')}</p>
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
                <p className="text-xs text-muted-foreground">{t('staff.complaints.resolved')}</p>
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
                <p className="text-xs text-muted-foreground">{t('staff.complaints.closed')}</p>
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
                {t('staff.complaints.filters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1">
                  <Search className="h-3 w-3" />
                  {t('staff.complaints.search')}
                </label>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('staff.complaints.searchComplaints')}
                />
              </div>
              <div className="flex flex-row justify-between">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.status')}</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('staff.complaints.all')}</SelectItem>
                      <SelectItem value="PENDING">{t('staff.complaints.pending')}</SelectItem>
                      <SelectItem value="IN_PROGRESS">{t('staff.complaints.inProgress')}</SelectItem>
                      <SelectItem value="RESOLVED">{t('staff.complaints.resolved')}</SelectItem>
                      <SelectItem value="CLOSED">{t('staff.complaints.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.category')}</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('staff.complaints.all')}</SelectItem>
                      <SelectItem value="Academic">{t('staff.complaints.academic')}</SelectItem>
                      <SelectItem value="Facilities">{t('staff.complaints.facilities')}</SelectItem>
                      <SelectItem value="IT">{t('staff.complaints.it')}</SelectItem>
                      <SelectItem value="Other">{t('staff.complaints.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.sortBy')}</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{t('staff.complaints.date')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Sort Order */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.order')}</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">{t('staff.complaints.latest')}</SelectItem>
                      <SelectItem value="asc">{t('staff.complaints.oldest')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSortBy("date");
                setSortOrder("desc");
              }}>
                {t('staff.complaints.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <StaffComplaintTable complaints={filtered} onUpdateComplaint={handleUpdateComplaint} />
        </main>
      </div>
    </div>
  );
}
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Complaint } from "@/components/complaints/types";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import ComplaintList from "@/components/complaints/ComplaintList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Page() {
  const { t } = useTranslation()

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch complaints on mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('/api/complaints');
        if (response.ok) {
          const data: Complaint[] = await response.json();
          setComplaints(data);
        }
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleCreate = async (payload: { category: string; description: string; attachment?: File }) => {
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('category', payload.category);
      formData.append('description', payload.description);
      if (payload.attachment) {
        formData.append('attachment', payload.attachment);
      }

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newComplaint = await response.json();
        setComplaints((s) => [{
          id: newComplaint.id,
          category: newComplaint.category,
          description: newComplaint.description,
          status: newComplaint.status,
          response: newComplaint.response,
          attachment: newComplaint.attachment,
          authorName: 'You', // Current user
          assigneeName: newComplaint.assigneeName,
          createdAt: newComplaint.createdAt,
          updatedAt: newComplaint.createdAt,
        }, ...s]);
        toast.success('Complaint submitted successfully');
        setDialogOpen(false); // Close dialog on success
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpen = (id: string) => {
    setComplaints((list) => {
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) return list;
      const copy = [...list];
      const [sel] = copy.splice(idx, 1);
      return [sel, ...copy];
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return complaints.filter((c) => {
      const matchesQuery = c.category.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [complaints, query, statusFilter]);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t('complaints.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('complaints.intro')}</p>
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
              <CardTitle>{t('complaints.newComplaint')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full">{t('complaints.createComplaint')}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg">{t('complaints.createComplaintTitle')}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <ComplaintForm onSubmit={(p) => { handleCreate(p); }} isLoading={creating} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <Input className="h-12 text-base" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('complaints.search')} />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('complaints.allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('complaints.allStatuses')}</SelectItem>
                  <SelectItem value="PENDING">{t('complaints.status.pending')}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{t('complaints.status.in_progress')}</SelectItem>
                  <SelectItem value="RESOLVED">{t('complaints.status.resolved')}</SelectItem>
                  <SelectItem value="CLOSED">{t('complaints.status.closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ComplaintList complaints={filtered} onOpen={handleOpen} loading={loading} />
        </main>
      </div>
    </div>
  );
}
"use client";
import React, { useMemo, useState } from "react";
import { complaints as placeholderComplaints, users as placeholderUsers } from "@/lib/placeholder-data";
import { Complaint } from "@/components/complaints/types";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import ComplaintList from "@/components/complaints/ComplaintList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation()
  const initial = (placeholderComplaints || []).map((c) => {
    const user = (placeholderUsers || []).find((u) => u.id === c.userId);
    return {
      id: c.id,
      category: c.category,
      description: c.description,
      status: c.status,
      reporterName: user?.name,
      assigneeName: null,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
    } as Complaint;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(initial);
  const [query, setQuery] = useState("");

  const handleCreate = (payload: { category?: string; description: string; reporterName?: string }) => {
    const newOne: Complaint = {
      id: String(Date.now()),
      category: payload.category,
      description: payload.description,
      status: "PENDING",
      reporterName: payload.reporterName,
      assigneeName: null,
      createdAt: new Date().toISOString(),
    };
    setComplaints((s) => [newOne, ...s]);
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
    return complaints.filter((c) => c.category?.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || (c.reporterName || "").toLowerCase().includes(q));
  }, [complaints, query]);

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full">{t('complaints.createComplaint')}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg">{t('complaints.createComplaintTitle')}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <ComplaintForm onSubmit={(p) => { handleCreate(p); }} />
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
              <Button size="lg" variant="outline">{t('complaints.filter')}</Button>
            </div>
          </div>

          <ComplaintList complaints={filtered} onOpen={handleOpen} />
        </main>
      </div>
    </div>
  );
}
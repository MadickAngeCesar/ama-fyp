"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  onSubmit: (payload: { category?: string; description: string; reporterName?: string }) => void;
};

export default function ComplaintForm({ onSubmit }: Props) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ category: category.trim() || undefined, description: description.trim(), reporterName: reporterName.trim() || undefined });
    setCategory("");
    setDescription("");
    setReporterName("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Category</label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Facilities, IT" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">Your name (optional)</label>
        <Input value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="John Student" />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create complaint</Button>
      </div>
    </form>
  );
}

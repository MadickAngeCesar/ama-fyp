"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: (payload: { category: string; description: string; attachment?: File }) => void;
  isLoading?: boolean;
};

export default function ComplaintForm({ onSubmit, isLoading = false }: Props) {
  const { t } = useTranslation()
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !category.trim() || isLoading) return;
    onSubmit({ category: category.trim(), description: description.trim(), attachment: attachment || undefined });
    setCategory("");
    setDescription("");
    setAttachment(null);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.category')}</label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={t('complaints.categoryPlaceholder')} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.descriptionLabel')}</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('complaints.descriptionPlaceholder')} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.attachment')}</label>
        <Input type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)} accept="image/*,.pdf" />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('complaints.creatingComplaint') : t('complaints.createComplaint')}
        </Button>
      </div>
    </form>
  );
}

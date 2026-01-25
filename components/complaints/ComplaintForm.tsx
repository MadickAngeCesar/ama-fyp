"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: (payload: { category?: string; description: string; reporterName?: string }) => void;
};

export default function ComplaintForm({ onSubmit }: Props) {
  const { t } = useTranslation()
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
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.category')}</label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={t('complaints.categoryPlaceholder')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.descriptionLabel')}</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('complaints.descriptionPlaceholder')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.nameOptional')}</label>
        <Input value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder={t('complaints.namePlaceholder')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit">{t('complaints.createComplaint')}</Button>
      </div>
    </form>
  );
}

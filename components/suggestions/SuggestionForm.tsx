"use client";
import React, { useState } from "react";
import { Suggestion } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: (payload: Omit<Suggestion, "id" | "createdAt" | "upvotes">) => void;
};

/**
 * Suggestion form used by students to submit suggestions with improved UI.
 */
export default function SuggestionForm({ onSubmit }: Props) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), authorName: authorName.trim() || undefined });
      setTitle("");
      setDescription("");
      setAuthorName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('suggestions.titleLabel')}</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('suggestions.titlePlaceholder')} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('suggestions.descriptionLabel')}</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('suggestions.descriptionPlaceholder')} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('suggestions.nameOptional')}</label>
        <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder={t('suggestions.namePlaceholder')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading} loadingText={t('suggestions.submitting') ?? 'Submitting...'}>
          {t('suggestions.submit')}
        </Button>
      </div>
    </form>
  );
}

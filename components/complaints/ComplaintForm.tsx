"use client";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/config/categories/complaint");
      if (!response.ok) throw new Error("Failed to load categories");

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback categories
      setCategories(["Facilities", "IT Support", "Academic", "Administrative"]);
    }
  };

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
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t('complaints.categoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.descriptionLabel')}</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('complaints.descriptionPlaceholder')} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">{t('complaints.attachment')}</label>
        <input type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)} accept="image/*,.pdf" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80" />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('complaints.creatingComplaint') : t('complaints.createComplaint')}
        </Button>
      </div>
    </form>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoleLoaded, setUserRoleLoaded] = useState(false);

  useEffect(() => {
    loadCategories();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const response = await fetch("/api/auth/role");
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      }
    } catch (error) {
      console.error("Error loading user role:", error);
      // Default to false - hide admin features if we can't determine role
    } finally {
      setUserRoleLoaded(true);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/configuration/categories/complaint");
      if (!response.ok) throw new Error("Failed to load categories");

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback categories
      setCategories(["Facilities", "IT Support", "Academic", "Administrative"]);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    setIsAddingCategory(true);
    try {
      const response = await fetch("/api/configuration/categories/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "Unauthorized") {
          throw new Error("Only administrators can add new categories. Please contact your administrator if you need a new category.");
        }
        throw new Error(errorData.error || "Failed to add category");
      }

      const data = await response.json();
      setCategories(data.categories);
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowAddCategory(false);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add category");
    } finally {
      setIsAddingCategory(false);
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
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="flex-1">
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
          {userRoleLoaded && isAdmin && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddCategory(!showAddCategory)}
              title="Add new category"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showAddCategory && userRoleLoaded && isAdmin && (
          <div className="flex gap-2 mt-2 p-2 border rounded-md bg-muted/50">
            <Input
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              disabled={isAddingCategory}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddCategory}
              disabled={isAddingCategory || !newCategory.trim()}
            >
              {isAddingCategory ? "Adding..." : "Add"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddCategory(false);
                setNewCategory("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
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

"use client";
import React, { useState } from "react";
import { Suggestion } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  onSubmit: (payload: Omit<Suggestion, "id" | "createdAt" | "upvotes">) => void;
};

/**
 * Suggestion form used by students to submit suggestions with improved UI.
 */
export default function SuggestionForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), authorName: authorName.trim() || undefined });
    setTitle("");
    setDescription("");
    setAuthorName("");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short descriptive title" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your idea or issue in a few sentences" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">Your name (optional)</label>
        <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Jane Doe" />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Submit suggestion</Button>
      </div>
    </form>
  );
}

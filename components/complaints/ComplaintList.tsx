"use client";
import React from "react";
import { Complaint } from "./types";
import ComplaintCard from "./ComplaintCard";
import { useTranslation } from "react-i18next";

type Props = {
  complaints: Complaint[];
  onOpen?: (id: string) => void;
  loading?: boolean;
};

export default function ComplaintList({ complaints, onOpen, loading }: Props) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2 mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!complaints || complaints.length === 0) return <div className="text-sm text-muted-foreground">{t('complaints.noComplaints')}</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {complaints.map((c) => (
        <ComplaintCard key={c.id} complaint={c} onOpen={onOpen} />
      ))}
    </div>
  );
}

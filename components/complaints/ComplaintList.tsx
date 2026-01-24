"use client";
import React from "react";
import { Complaint } from "./types";
import ComplaintCard from "./ComplaintCard";

type Props = {
  complaints: Complaint[];
  onOpen?: (id: string) => void;
};

export default function ComplaintList({ complaints, onOpen }: Props) {
  if (!complaints || complaints.length === 0) return <div className="text-sm text-muted-foreground">No complaints yet.</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {complaints.map((c) => (
        <ComplaintCard key={c.id} complaint={c} onOpen={onOpen} />
      ))}
    </div>
  );
}

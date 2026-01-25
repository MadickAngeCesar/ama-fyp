"use client";
import React from "react";
import { Complaint } from "./types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  complaint: Complaint;
  onOpen?: (id: string) => void;
};

export default function ComplaintCard({ complaint, onOpen }: Props) {
  const { t, i18n } = useTranslation()
  return (
    <Card className="hover:shadow-md transition-shadow p-3">
      <CardHeader className="py-0">
        <CardTitle className="text-sm">{complaint.category ?? t('complaints.general')}</CardTitle>
      </CardHeader>

      <CardContent className="py-2">
        <div className="text-sm text-muted-foreground line-clamp-3">{complaint.description}</div>
      </CardContent>

      <CardFooter className="px-0 py-2">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">
            <span>{complaint.reporterName ?? t('sidebar.student')}</span>
            <span className="mx-2">•</span>
            <span>{new Date(complaint.createdAt).toLocaleDateString(i18n.language)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${complaint.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : complaint.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {t(`complaints.status.${(complaint.status ?? "PENDING").toLowerCase()}`)}
            </span>
            <Button size="sm" variant="outline" onClick={() => onOpen?.(complaint.id)}>{t('complaints.open')}</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

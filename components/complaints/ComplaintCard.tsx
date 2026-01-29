"use client";
import React from "react";
import { Complaint } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type Props = {
  complaint: Complaint;
  onOpen?: (id: string) => void;
};

export default function ComplaintCard({ complaint }: Props) {
  const { t, i18n } = useTranslation();
  return (
    <Card className="hover:shadow-md transition-shadow p-3">
      <CardHeader className="flex flex-row items-center justify-between py-0">
        <CardTitle className="text-sm">
          {complaint.category ?? t("complaints.general")}
        </CardTitle>

        <span
          className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${complaint.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : complaint.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
        >
          {t(
            `complaints.status.${(complaint.status ?? "PENDING").toLowerCase()}`,
          )}
        </span>
      </CardHeader>

      <CardContent className="py-2 text-sm text-muted-foreground line-clamp-3 mt-1">
        {complaint.description}
      </CardContent>

      <CardFooter className="px-0 py-2 text-xs text-muted-foreground justify-center">
        <span>{complaint.authorName ?? t("sidebar.student")}</span>
        <span className="mx-2">•</span>
        <span>
          {new Date(complaint.createdAt).toLocaleDateString(i18n.language)}
        </span>
      </CardFooter>
    </Card>
  );
}

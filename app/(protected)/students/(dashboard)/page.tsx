"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface StudentStats {
  complaints: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  suggestions: {
    total: number;
  };
  activeChats: number;
  recentComplaints: Array<{
    id: string;
    category: string | null;
    description: string;
    status: string;
    createdAt: string;
  }>;
  recentSuggestions: Array<{
    id: string;
    title: string;
    description: string;
    upvotes: number;
    createdAt: string;
  }>;
  recentChats: Array<{
    id: string;
    title: string;
    status: string;
    lastActivity: string;
  }>;
}

export default function Page() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/student");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch student stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-96" />
        </div>
        <div className="grid gap-4 grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-12 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const {
    complaints,
    suggestions,
    activeChats,
    recentComplaints,
    recentSuggestions,
    recentChats,
  } = stats;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("dashboard.complaints")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{complaints.total}</div>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.complaintsDesc")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("dashboard.suggestions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suggestions.total}</div>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.suggestionsDesc")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("dashboard.activeChats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeChats}</div>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.activeChatsDesc")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentComplaints")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {c.category || t("complaints.general")}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {c.description}
                    </div>
                  </div>
                  <Badge variant="secondary">{c.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.noComplaints")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentSuggestions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSuggestions.length > 0 ? (
              recentSuggestions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {s.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.upvotes} {t("dashboard.upvotes")}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.noSuggestions")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Chats */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.activeChatSessions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="text-sm font-medium">{chat.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("dashboard.lastActive")}:{" "}
                    {new Date(chat.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.noActiveChats")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

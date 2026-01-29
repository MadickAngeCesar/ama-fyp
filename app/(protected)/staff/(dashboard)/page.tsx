"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Lightbulb, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface StaffStats {
  complaints: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  suggestions: {
    total: number;
    pending: number;
  };
  chats: {
    active: number;
    escalated: number;
  };
  recentPendingComplaints: Array<{
    id: string;
    category: string | null;
    description: string;
    createdAt: string;
    user: { name: string | null } | null;
  }>;
  recentPendingSuggestions: Array<{
    id: string;
    title: string;
    description: string;
    upvotes: number;
    createdAt: string;
    user: { name: string | null } | null;
  }>;
  recentActiveChats: Array<{
    id: string;
    title: string;
    lastActivity: string;
  }>;
}

/**
 * Staff dashboard page providing overview of complaints, suggestions, and chat sessions.
 */
export default function Page() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/staff');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch staff stats:', error);
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
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 w-4 bg-muted rounded" />
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

  const { complaints, suggestions, chats, recentPendingComplaints, recentPendingSuggestions, recentActiveChats } = stats;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t('staff.dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('staff.dashboard.description')}</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button asChild>
            <Link href="/staff/suggestion">{t('staff.dashboard.viewAllSuggestions')}</Link>
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('staff.dashboard.pendingComplaints')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.pending}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round((complaints.pending / complaints.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('staff.dashboard.inProgress')}</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Being actively worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('staff.dashboard.pendingSuggestions')}</CardTitle>
            <Lightbulb className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('staff.dashboard.activeChats')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chats.active}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated Chats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chats.escalated}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('staff.dashboard.resolutionRate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {complaints.total > 0 ? Math.round((complaints.resolved / complaints.total) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              {complaints.resolved} of {complaints.total} complaints resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('staff.dashboard.totalComplaints')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{complaints.total}</div>
            <p className="text-sm text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('staff.dashboard.totalSuggestions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suggestions.total}</div>
            <p className="text-sm text-muted-foreground">
              Student feedback received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items Requiring Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              {t('staff.dashboard.recentPendingComplaints')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPendingComplaints.length > 0 ? (
              recentPendingComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{c.category || t('staff.dashboard.general')}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{c.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('staff.dashboard.by')} {c.user?.name || t('staff.complaints.anonymous')} • {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">{t('staff.dashboard.pending')}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('staff.dashboard.noPendingComplaints')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-500" />
              {t('staff.dashboard.recentPendingSuggestions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPendingSuggestions.length > 0 ? (
              recentPendingSuggestions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{s.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('staff.dashboard.by')} {s.user?.name || t('staff.complaints.anonymous')} • {s.upvotes} {t('staff.dashboard.upvotes')}
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">{t('staff.dashboard.pending')}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('staff.dashboard.noPendingSuggestions')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              {t('staff.dashboard.activeChatSessions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActiveChats.length > 0 ? (
              recentActiveChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('staff.dashboard.lastActive')}: {new Date(chat.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="default" className="ml-2">Active</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('staff.dashboard.noActiveChats')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('staff.dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/staff/complaint">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t('staff.dashboard.manageComplaints')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/staff/suggestion">
                <Lightbulb className="h-4 w-4 mr-2" />
                {t('staff.dashboard.reviewSuggestions')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/staff/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('staff.dashboard.viewChatSessions')}
              </Link>
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('staff.dashboard.viewReports')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
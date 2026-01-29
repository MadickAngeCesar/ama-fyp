"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Lightbulb, Activity } from "lucide-react"

interface Stats {
  users: number;
  complaints: number;
  suggestions: number;
  auditLogs: number;
  recentActivities: Array<{
    id: string;
    actorId: string | null;
    action: string;
    entity: string;
    entityId: string;
    detail: string | null;
    createdAt: string;
    actor: string;
  }>;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = stats ? [
    {
      title: t('admin.dashboard.stats.users'),
      value: stats.users,
      icon: Users,
      description: t('admin.dashboard.stats.usersDesc'),
    },
    {
      title: t('admin.dashboard.stats.complaints'),
      value: stats.complaints,
      icon: FileText,
      description: t('admin.dashboard.stats.complaintsDesc'),
    },
    {
      title: t('admin.dashboard.stats.suggestions'),
      value: stats.suggestions,
      icon: Lightbulb,
      description: t('admin.dashboard.stats.suggestionsDesc'),
    },
    {
      title: t('admin.dashboard.stats.auditLogs'),
      value: stats.auditLogs,
      icon: Activity,
      description: t('admin.dashboard.stats.auditLogsDesc'),
    },
  ] : [];

  const recentActivities = stats?.recentActivities || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboard.description')}</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
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
          ))
        ) : (
          dashboardStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboard.recentActivity')}</CardTitle>
          <CardDescription>{t('admin.dashboard.recentActivityDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.actor}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} {activity.entity} - {activity.detail}
                  </p>
                </div>
                <Badge variant="outline">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
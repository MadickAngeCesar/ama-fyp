"use client"

import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Lightbulb, Activity } from "lucide-react"
import { users, complaints, suggestions, auditLogs } from "@/lib/placeholder-data"

export default function AdminDashboardPage() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t('admin.dashboard.stats.users'),
      value: users.length,
      icon: Users,
      description: t('admin.dashboard.stats.usersDesc'),
    },
    {
      title: t('admin.dashboard.stats.complaints'),
      value: complaints.length,
      icon: FileText,
      description: t('admin.dashboard.stats.complaintsDesc'),
    },
    {
      title: t('admin.dashboard.stats.suggestions'),
      value: suggestions.length,
      icon: Lightbulb,
      description: t('admin.dashboard.stats.suggestionsDesc'),
    },
    {
      title: t('admin.dashboard.stats.auditLogs'),
      value: auditLogs.length,
      icon: Activity,
      description: t('admin.dashboard.stats.auditLogsDesc'),
    },
  ]

  const recentActivities = auditLogs.slice(0, 5).map(log => ({
    ...log,
    actor: users.find(u => u.id === log.actorId)?.name || 'Unknown',
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboard.description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
        ))}
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
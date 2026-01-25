"use client";
import React from "react";
import { complaints, suggestions, chatSessions } from "@/lib/placeholder-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation()
  // Mock stats
  const totalComplaints = complaints.length;
  const totalSuggestions = suggestions.length;
  const activeChats = chatSessions.filter(s => s.status === 'OPEN').length;

  // Recent items (last 3)
  const recentComplaints = complaints.slice(-3).reverse();
  const recentSuggestions = suggestions.slice(-3).reverse();
  const recentChats = chatSessions.slice(-3).reverse();

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline">{t('dashboard.viewAll')}</Button>
          <Button>{t('dashboard.contactStaff')}</Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.complaints')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalComplaints}</div>
            <p className="text-sm text-muted-foreground">{t('dashboard.complaintsDesc')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.suggestions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSuggestions}</div>
            <p className="text-sm text-muted-foreground">{t('dashboard.suggestionsDesc')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.activeChats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeChats}</div>
            <p className="text-sm text-muted-foreground">{t('dashboard.activeChatsDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentComplaints')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="text-sm font-medium">{c.category || t('complaints.general')}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{c.description}</div>
                  </div>
                  <Badge variant="secondary">{c.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.noComplaints')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentSuggestions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSuggestions.length > 0 ? (
              recentSuggestions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{s.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.upvotes} {t('dashboard.upvotes')}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.noSuggestions')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.activeChatSessions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="text-sm font-medium">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">{t('dashboard.lastActive')}: {new Date(chat.lastActivity).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline">{chat.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.noActiveChats')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>{t('dashboard.createComplaint')}</Button>
            <Button variant="outline">{t('dashboard.shareSuggestion')}</Button>
            <Button variant="outline">{t('dashboard.startChat')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
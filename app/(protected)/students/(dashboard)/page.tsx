"use client";
import React from "react";
import { complaints, suggestions, chatSessions } from "@/lib/placeholder-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Page() {
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
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your complaints, suggestions, and support chats.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline">View All</Button>
          <Button>Contact Staff</Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalComplaints}</div>
            <p className="text-sm text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSuggestions}</div>
            <p className="text-sm text-muted-foreground">Ideas shared</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeChats}</div>
            <p className="text-sm text-muted-foreground">Ongoing conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="text-sm font-medium">{c.category || 'General'}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{c.description}</div>
                  </div>
                  <Badge variant="secondary">{c.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No complaints yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSuggestions.length > 0 ? (
              recentSuggestions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{s.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.upvotes} upvotes</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No suggestions yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Chat Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="text-sm font-medium">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">Last active: {new Date(chat.lastActivity).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline">{chat.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active chats.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Create Complaint</Button>
            <Button variant="outline">Share Suggestion</Button>
            <Button variant="outline">Start Chat</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
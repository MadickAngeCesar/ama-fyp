"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Complaint } from "@/components/complaints/types";
import StaffComplaintTable from "@/components/complaints/StaffComplaintTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Clock, Filter, Search, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

interface UserApiResponse {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
}

/**
 * Staff complaint management page.
 * Allows staff to view, filter, sort, and manage complaints.
 */
export default function Page() {
  const { t } = useTranslation();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [staffMembers, setStaffMembers] = useState<{ id: string; name: string }[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Fetch complaints and staff on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsResponse, usersResponse] = await Promise.all([
          fetch('/api/complaints'),
          fetch('/api/users')
        ]);

        if (complaintsResponse.ok) {
          const complaintsData: Complaint[] = await complaintsResponse.json();
          setComplaints(complaintsData);
        }

        if (usersResponse.ok) {
          const users: UserApiResponse[] = await usersResponse.json();
          const staff = users.filter((u: UserApiResponse) => u.role === 'STAFF').map((u: UserApiResponse) => ({
            id: u.id,
            name: u.name || u.email
          }));
          setStaffMembers(staff);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    // Prepare data for Excel export
    const exportData = filtered.map(complaint => ({
      'ID': complaint.id,
      'Category': complaint.category,
      'Description': complaint.description,
      'Status': complaint.status,
      'Author': complaint.authorName,
      'Assignee': complaint.assigneeName || 'Unassigned',
      'Response': complaint.response || '',
      'Created At': new Date(complaint.createdAt).toLocaleDateString(),
      'Updated At': new Date(complaint.updatedAt).toLocaleDateString(),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = [
      { wch: 36 }, // ID
      { wch: 15 }, // Category
      { wch: 50 }, // Description
      { wch: 12 }, // Status
      { wch: 20 }, // Author
      { wch: 20 }, // Assignee
      { wch: 50 }, // Response
      { wch: 12 }, // Created At
      { wch: 12 }, // Updated At
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Complaints');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `complaints_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
    toast.success('Complaints exported successfully');
  };

  const handleUpdateComplaint = async (id: string, action: string, data?: { assigneeId?: string; status?: string; response?: string }) => {
    try {
      const requestData: { action: string; assigneeId?: string; status?: string; response?: string } = { action };

      switch (action) {
        case 'assign':
          if (data?.assigneeId) {
            requestData.assigneeId = data.assigneeId;
          }
          break;
        case 'update_status':
          if (data?.status) {
            requestData.status = data.status;
          }
          break;
        case 'respond':
          if (data?.response) {
            requestData.response = data.response;
          }
          break;
        case 'close':
          // No additional data needed
          break;
        default:
          throw new Error('Invalid action');
      }

      const response = await fetch(`/api/complaints/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const updatedComplaint = await response.json();
        setComplaints((list) =>
          list.map((c) =>
            c.id === id
              ? {
                  ...updatedComplaint,
                  responses: updatedComplaint.response ? [{
                    id: `response-${Date.now()}`,
                    content: updatedComplaint.response,
                    authorName: 'Staff', // Current user
                    createdAt: new Date().toISOString(),
                  }] : c.responses,
                }
              : c
          )
        );
        toast.success('Complaint updated successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to update complaint');
      }
    } catch (error) {
      console.error('Failed to update complaint:', error);
      toast.error('Failed to update complaint. Please try again.');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComplaints((list) => list.filter((c) => c.id !== id));
        toast.success('Complaint deleted successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to delete complaint');
      }
    } catch (error) {
      console.error('Failed to delete complaint:', error);
      toast.error('Failed to delete complaint. Please try again.');
    }
  };

  const filtered = useMemo(() => {
    const out = complaints.filter((c) => {
      const matchesQuery = c.description.toLowerCase().includes(query.toLowerCase()) ||
                           c.authorName.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
    const sorted = [...out];
    if (sortBy === "date") {
      sorted.sort((a, b) => sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [complaints, query, statusFilter, categoryFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'PENDING').length;
    const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const closed = complaints.filter(c => c.status === 'CLOSED').length;
    return { total, pending, inProgress, resolved, closed };
  }, [complaints]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('staff.complaints.manage')}</h1>
            <p className="text-sm text-muted-foreground">{t('staff.complaints.review')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Filter className="h-4 w-4 mr-2" />
          {t('staff.complaints.export')}
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-lg font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-lg font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.inProgress')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-lg font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.resolved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-lg font-bold">{stats.closed}</p>
                <p className="text-xs text-muted-foreground">{t('staff.complaints.closed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1">
          <Card className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                {t('staff.complaints.filters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1">
                  <Search className="h-3 w-3" />
                  {t('staff.complaints.search')}
                </label>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('staff.complaints.searchComplaints')}
                />
              </div>
              <div className="flex flex-row justify-between">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.status')}</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={t('staff.complaints.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('staff.complaints.all')}</SelectItem>
                      <SelectItem value="PENDING">{t('staff.complaints.pending')}</SelectItem>
                      <SelectItem value="IN_PROGRESS">{t('staff.complaints.inProgress')}</SelectItem>
                      <SelectItem value="RESOLVED">{t('staff.complaints.resolved')}</SelectItem>
                      <SelectItem value="CLOSED">{t('staff.complaints.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.category')}</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={t('staff.complaints.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('staff.complaints.all')}</SelectItem>
                      <SelectItem value="Academic">{t('staff.complaints.academic')}</SelectItem>
                      <SelectItem value="Facilities">{t('staff.complaints.facilities')}</SelectItem>
                      <SelectItem value="IT">{t('staff.complaints.it')}</SelectItem>
                      <SelectItem value="Other">{t('staff.complaints.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.sortBy')}</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={t('staff.complaints.date')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{t('staff.complaints.date')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Sort Order */}
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('staff.complaints.order')}</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={t('staff.complaints.latest')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">{t('staff.complaints.latest')}</SelectItem>
                      <SelectItem value="asc">{t('staff.complaints.oldest')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSortBy("date");
                setSortOrder("desc");
              }}>
                {t('staff.complaints.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <StaffComplaintTable
            complaints={filtered}
            onUpdateComplaint={handleUpdateComplaint}
            onDeleteComplaint={handleDeleteComplaint}
            staffMembers={staffMembers}
          />
        </main>
      </div>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import { Complaint } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, User, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Props for StaffComplaintTable component.
 */
interface StaffComplaintTableProps {
  /** List of complaints to display */
  complaints: Complaint[];
  /** Callback to update a complaint with action and data */
  onUpdateComplaint: (id: string, action: string, data?: { assigneeId?: string; status?: string; response?: string }) => void;
  /** Callback to delete a complaint */
  onDeleteComplaint: (id: string) => void;
  /** List of available staff members for assignment */
  staffMembers?: { id: string; name: string }[];
}

/**
 * StaffComplaintTable component for managing complaints in the staff portal.
 * Displays complaints in a table with actions to view, respond, change status, and assign.
 */
export default function StaffComplaintTable({ complaints, onUpdateComplaint, onDeleteComplaint, staffMembers = [] }: StaffComplaintTableProps) {
  const { t } = useTranslation();
  const [responseText, setResponseText] = useState("");

  const handleRespond = (complaint: Complaint) => {
    if (!responseText.trim()) return;
    onUpdateComplaint(complaint.id, 'respond', { response: responseText });
    setResponseText("");
  };

  const handleStatusChange = (id: string, status: string) => {
    onUpdateComplaint(id, 'update_status', { status });
  };

  const handleAssign = (id: string, assigneeId: string) => {
    // Handle unassignment case
    if (assigneeId === 'unassigned') {
      onUpdateComplaint(id, 'assign', { assigneeId: '' });
    } else {
      onUpdateComplaint(id, 'assign', { assigneeId });
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">{t('complaints.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                {/*<TableHead>Reporter</TableHead>*/}
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.category || "General"}</TableCell>
                  <TableCell className="max-w-32 truncate">{complaint.description}</TableCell>
                  <TableCell>
                    <Select
                      value={complaint.status || "PENDING"}
                      onValueChange={(value) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={complaint.assigneeName ? staffMembers.find(s => s.name === complaint.assigneeName)?.id || 'unassigned' : 'unassigned'}
                      onValueChange={(value) => handleAssign(complaint.id, value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/*<TableCell className="max-w-xs truncate">{complaint.authorName || "Anonymous"}</TableCell>*/}
                  <TableCell className="hidden lg:table-cell text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('staff.complaints.complaintDetails')}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">{t('staff.complaints.categoryLabel')}</h4>
                              <p>{complaint.category || "General"}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">{t('staff.complaints.descriptionLabel')}</h4>
                              <p>{complaint.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">{t('staff.complaints.statusLabel')}</h4>
                              <Badge variant={complaint.status === "RESOLVED" ? "default" : "secondary"}>
                                {complaint.status || "PENDING"}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium">{t('staff.complaints.reporter')}</h4>
                              <p>{complaint.authorName || t('staff.complaints.anonymous')}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">{t('staff.complaints.created')}</h4>
                              <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                            </div>
                            {(complaint.responses || []).length > 0 && (
                              <div>
                                <h4 className="font-medium">{t('staff.complaints.responses')}</h4>
                                <div className="space-y-2">
                                  {(complaint.responses || []).map((response) => (
                                    <div key={response.id} className="p-2 bg-muted rounded">
                                      <p className="text-sm">{response.content}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {response.authorName} • {new Date(response.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('staff.complaints.respondToComplaint')}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder={t('staff.complaints.enterResponse')}
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                            />
                            <Button onClick={() => handleRespond(complaint)}>{t('staff.complaints.sendResponse')}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select onValueChange={(value) => handleAssign(complaint.id, value)}>
                        <SelectTrigger className="w-24">
                          <User className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteComplaint(complaint.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="p-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{complaint.category || "General"}</h3>
                    <p className="text-xs text-muted-foreground">{complaint.description.slice(0, 100)}...</p>
                  </div>
                  <Select
                    value={complaint.status || "PENDING"}
                    onValueChange={(value) => handleStatusChange(complaint.id, value)}
                  >
                    <SelectTrigger className="w-24 h-7 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={complaint.assigneeName ? staffMembers.find(s => s.name === complaint.assigneeName)?.id || 'unassigned' : 'unassigned'}
                    onValueChange={(value) => handleAssign(complaint.id, value)}
                  >
                    <SelectTrigger className="w-20 h-7 text-xs">
                      <SelectValue placeholder="Assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">By {complaint.authorName || "Anonymous"} • {new Date(complaint.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('staff.complaints.complaintDetails')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">{t('staff.complaints.categoryLabel')}</h4>
                          <p>{complaint.category || "General"}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">{t('staff.complaints.descriptionLabel')}</h4>
                          <p>{complaint.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">{t('staff.complaints.statusLabel')}</h4>
                          <Badge variant={complaint.status === "RESOLVED" ? "default" : "secondary"}>
                            {complaint.status || "PENDING"}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium">{t('staff.complaints.reporter')}</h4>
                          <p>{complaint.authorName || t('staff.complaints.anonymous')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">{t('staff.complaints.created')}</h4>
                          <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                        {(complaint.responses || []).length > 0 && (
                          <div>
                            <h4 className="font-medium">{t('staff.complaints.responses')}</h4>
                            <div className="space-y-2">
                              {(complaint.responses || []).map((response) => (
                                <div key={response.id} className="p-2 bg-muted rounded">
                                  <p className="text-sm">{response.content}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {response.authorName} • {new Date(response.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('staff.complaints.respondToComplaint')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder={t('staff.complaints.enterResponse')}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                        />
                        <Button onClick={() => handleRespond(complaint)}>{t('staff.complaints.sendResponse')}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComplaint(complaint.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
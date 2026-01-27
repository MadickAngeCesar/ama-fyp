"use client";
import React, { useState } from "react";
import { Suggestion, SuggestionResponse } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";

/**
 * Props for StaffSuggestionTable component.
 */
interface StaffSuggestionTableProps {
  /** List of suggestions to display */
  suggestions: Suggestion[];
  /** Callback to update a suggestion */
  onUpdateSuggestion: (id: string, updates: Partial<Suggestion>) => void;
  /** List of available staff members for assignment */
  staffMembers?: Array<{id: string, name: string}>;
}

/**
 * StaffSuggestionTable component for managing suggestions in the staff portal.
 * Displays suggestions in a table with actions to view, respond, change status, and assign.
 */
export default function StaffSuggestionTable({ suggestions, onUpdateSuggestion, staffMembers = [] }: StaffSuggestionTableProps) {
  const { t } = useTranslation();
  const [responseText, setResponseText] = useState("");

  const handleRespond = (suggestion: Suggestion) => {
    if (!responseText.trim()) return;
    const newResponse: SuggestionResponse = {
      id: Date.now().toString(),
      content: responseText,
      authorName: "Staff Member", // Placeholder
      createdAt: new Date().toISOString(),
    };
    onUpdateSuggestion(suggestion.id, {
      responses: [...(suggestion.responses || []), newResponse],
    });
    setResponseText("");
  };

  const handleStatusChange = (id: string, status: string) => {
    onUpdateSuggestion(id, { status: status as 'pending' | 'in_progress' | 'resolved' | 'closed' });
  };

  const handleAssign = (id: string, assignedTo: string) => {
    onUpdateSuggestion(id, { assignedTo });
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">{t('suggestions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                {/*<TableHead>Author</TableHead>*/}
                <TableHead>Status</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.map((suggestion) => (
                <TableRow key={suggestion.id}>
                  <TableCell className="font-medium max-w-xs truncate">{suggestion.title}</TableCell>
                  {/*<TableCell className="max-w-xs truncate">{suggestion.authorName || "Anonymous"}</TableCell>*/}
                  <TableCell>
                    <Select
                      value={suggestion.status || "pending"}
                      onValueChange={(value) => handleStatusChange(suggestion.id, value)}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">{suggestion.upvotes}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{new Date(suggestion.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="text-lg">{suggestion.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">{t('staff.suggestions.responses')}:</h4>
                              {suggestion.responses?.map((resp) => (
                                <div key={resp.id} className="border p-2 rounded text-sm">
                                  <p>{resp.content}</p>
                                  <p className="text-xs text-muted-foreground">{t('staff.suggestions.by')} {resp.authorName} {t('staff.suggestions.on')} {new Date(resp.createdAt).toLocaleString()}</p>
                                </div>
                              )) || <p className="text-sm text-muted-foreground">{t('staff.suggestions.noResponses')}</p>}
                            </div>
                            <div className="space-y-2">
                              <Textarea
                                placeholder={t('staff.suggestions.addResponse')}
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                className="min-h-20"
                              />
                              <Button size="sm" onClick={() => handleRespond(suggestion)} className="w-full">
                                {t('staff.suggestions.respond')}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select onValueChange={(value) => handleAssign(suggestion.id, value)}>
                        <SelectTrigger className="w-23 h-8">
                          <SelectValue placeholder={suggestion.assignedTo || "Assign"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.name}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-sm leading-tight">{suggestion.title}</h3>
                  <Select
                    value={suggestion.status || "pending"}
                    onValueChange={(value) => handleStatusChange(suggestion.id, value)}
                  >
                    <SelectTrigger className="w-24 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">By {suggestion.authorName || "Anonymous"} • {suggestion.upvotes} upvotes</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-base">{suggestion.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">{t('staff.suggestions.responses')}:</h4>
                          {suggestion.responses?.map((resp) => (
                            <div key={resp.id} className="border p-2 rounded text-sm">
                              <p>{resp.content}</p>
                              <p className="text-xs text-muted-foreground">{t('staff.suggestions.by')} {resp.authorName} {t('staff.suggestions.on')} {new Date(resp.createdAt).toLocaleString()}</p>
                            </div>
                          )) || <p className="text-sm text-muted-foreground">{t('staff.suggestions.noResponses')}</p>}
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            placeholder={t('staff.suggestions.addResponse')}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            className="min-h-16"
                          />
                          <Button size="sm" onClick={() => handleRespond(suggestion)} className="w-full">
                            {t('staff.suggestions.respond')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Select onValueChange={(value) => handleAssign(suggestion.id, value)}>
                    <SelectTrigger className="w-20 h-7 text-xs">
                      <SelectValue placeholder="Assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff1">Staff 1</SelectItem>
                      <SelectItem value="staff2">Staff 2</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
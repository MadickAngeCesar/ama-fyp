"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string;
  detail: string | null;
  createdAt: string;
  actorName: string;
}

export default function AdminAuditPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [entityFilter, setEntityFilter] = useState("")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/audit');
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const actor = log.actorName;
    const matchesSearch = actor.toLowerCase().includes(search.toLowerCase()) ||
                         log.action.toLowerCase().includes(search.toLowerCase()) ||
                         log.entity.toLowerCase().includes(search.toLowerCase()) ||
                         (log.detail?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesAction = actionFilter === "all" || !actionFilter || log.action === actionFilter
    const matchesEntity = entityFilter === "all" || !entityFilter || log.entity === entityFilter
    return matchesSearch && matchesAction && matchesEntity
  })

  const actions = [...new Set(logs.map(log => log.action))]
  const entities = [...new Set(logs.map(log => log.entity))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.audit.title')}</h1>
        <p className="text-muted-foreground">{t('admin.audit.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.audit.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.audit.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder={t('admin.audit.action')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.audit.allActions')}</SelectItem>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder={t('admin.audit.entity')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.audit.allEntities')}</SelectItem>
                {entities.map(entity => (
                  <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.audit.logs')}</CardTitle>
          <CardDescription>{t('admin.audit.logsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.audit.actor')}</TableHead>
                <TableHead>{t('admin.audit.action')}</TableHead>
                <TableHead>{t('admin.audit.entity')}</TableHead>
                <TableHead>{t('admin.audit.detail')}</TableHead>
                <TableHead>{t('admin.audit.date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.actorName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>{log.detail || '-'}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.audit.noLogs')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
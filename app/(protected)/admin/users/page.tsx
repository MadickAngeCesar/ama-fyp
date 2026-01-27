"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Plus, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type UserRole = "STUDENT" | "STAFF" | "ADMIN"

type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState("")
  const [addingUser, setAddingUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "STUDENT" as UserRole })
  const [, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleEditRole = (user: User) => {
    setEditingUser(user)
    setNewRole(user.role)
  }

  const handleSaveRole = async () => {
    if (editingUser) {
      try {
        const res = await fetch(`/api/users/${editingUser.id}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        })
        if (res.ok) {
          setEditingUser(null)
          fetchUsers()
        }
      } catch (error) {
        console.error('Failed to update role:', error)
      }
    }
  }

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
        if (res.ok) {
          setAddingUser(false)
          setNewUser({ name: "", email: "", role: "STUDENT" as UserRole })
          fetchUsers()
        } else {
          const errorData = await res.json()
          alert(`Failed to add user: ${errorData.error}${errorData.details ? '\nDetails: ' + JSON.stringify(errorData.details) : ''}`)
        }
      } catch (error) {
        console.error('Failed to add user:', error)
        alert('Failed to add user: Network error')
      }
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to remove user:', error)
    }
  }

  const roles = ['STUDENT', 'STAFF', 'ADMIN']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
        <p className="text-muted-foreground">{t('admin.users.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.filters')}</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>{t('admin.users.filtersDesc')}</CardDescription>
            <Dialog open={addingUser} onOpenChange={setAddingUser}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.users.addUser')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.users.addUser')}</DialogTitle>
                  <DialogDescription>{t('admin.users.addUserDesc')}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {t('admin.users.name')}
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="col-span-3"
                      placeholder={t('admin.users.namePlaceholder')}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      {t('admin.users.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="col-span-3"
                      placeholder={t('admin.users.emailPlaceholder')}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      {t('admin.users.role')}
                    </Label>
                    <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddUser}>{t('admin.users.add')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.users.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder={t('admin.users.role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.users.allRoles')}</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.list')}</CardTitle>
          <CardDescription>{t('admin.users.listDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.users.name')}</TableHead>
                <TableHead>{t('admin.users.email')}</TableHead>
                <TableHead>{t('admin.users.role')}</TableHead>
                <TableHead>{t('admin.users.created')}</TableHead>
                <TableHead>{t('admin.users.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'STAFF' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEditRole(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t('admin.users.editRole')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('admin.users.editRole')}</DialogTitle>
                            <DialogDescription>{t('admin.users.editRoleDesc', { name: user.name })}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                {t('admin.users.role')}
                              </Label>
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSaveRole}>{t('admin.users.save')}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('admin.users.remove')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.users.removeUser')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.users.removeUserDesc', { name: user.name })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('admin.users.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveUser(user.id)}>
                              {t('admin.users.confirmRemove')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.users.noUsers')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
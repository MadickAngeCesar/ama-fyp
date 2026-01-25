"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

export default function AdminConfigurationPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState(['Facilities', 'IT Support', 'Academic', 'Administrative'])
  const [newCategory, setNewCategory] = useState("")
  const [retentionYears, setRetentionYears] = useState(5)

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category))
  }

  const handleSave = () => {
    // In real app, save to DB
    console.log('Saving configuration:', { categories, retentionYears })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.config.title')}</h1>
        <p className="text-muted-foreground">{t('admin.config.description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.config.categories')}</CardTitle>
            <CardDescription>{t('admin.config.categoriesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder={t('admin.config.newCategory')}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.config.retention')}</CardTitle>
            <CardDescription>{t('admin.config.retentionDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="retention" className="text-right">
                {t('admin.config.retentionYears')}
              </Label>
              <Input
                id="retention"
                type="number"
                value={retentionYears}
                onChange={(e) => setRetentionYears(Number(e.target.value))}
                className="col-span-3"
                min="1"
                max="10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('admin.config.retentionNote')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.config.systemSettings')}</CardTitle>
          <CardDescription>{t('admin.config.systemSettingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxFileSize" className="text-right">
              {t('admin.config.maxFileSize')}
            </Label>
            <Input
              id="maxFileSize"
              type="number"
              defaultValue={10}
              className="col-span-3"
              min="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supportEmail" className="text-right">
              {t('admin.config.supportEmail')}
            </Label>
            <Input
              id="supportEmail"
              type="email"
              defaultValue="support@university.edu"
              className="col-span-3"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>{t('admin.config.save')}</Button>
      </div>
    </div>
  )
}
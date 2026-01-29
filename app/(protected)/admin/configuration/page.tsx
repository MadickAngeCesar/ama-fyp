"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminConfigurationPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [retentionYears, setRetentionYears] = useState(5)
  const [maxFileSize, setMaxFileSize] = useState(10)
  const [supportEmail, setSupportEmail] = useState("support@university.edu")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    try {
      const response = await fetch("/api/configuration")
      if (!response.ok) throw new Error("Failed to load configuration")

      const data = await response.json()
      const config = data.configurations

      setCategories(config["categories.complaint"] || ["Facilities", "IT Support", "Academic", "Administrative"])
      setRetentionYears(config["retention.years"] || 5)
      setMaxFileSize(config["system.maxFileSize"] || 10)
      setSupportEmail(config["system.supportEmail"] || "support@university.edu")
    } catch (error) {
      console.error("Error loading configuration:", error)
      toast.error("Failed to load configuration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const configurationData = {
        "categories.complaint": categories,
        "categories.suggestion": categories, // Use same categories for suggestions
        "retention.years": retentionYears,
        "system.maxFileSize": maxFileSize,
        "system.supportEmail": supportEmail
      }

      const response = await fetch("/api/configuration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configurations: configurationData }),
      })

      if (!response.ok) throw new Error("Failed to save configuration")

      toast.success("Configuration saved successfully")
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast.error("Failed to save configuration")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
                disabled={isSaving}
              />
              <Button onClick={handleAddCategory} disabled={isSaving}>
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
                    disabled={isSaving}
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
                disabled={isSaving}
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
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(Number(e.target.value))}
              className="col-span-3"
              min="1"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supportEmail" className="text-right">
              {t('admin.config.supportEmail')}
            </Label>
            <Input
              id="supportEmail"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('admin.config.save')}
        </Button>
      </div>
    </div>
  )
}
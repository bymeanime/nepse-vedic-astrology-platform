'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Settings,
  Save,
  Globe,
  Sparkles,
  BarChart3,
  Palette,
} from 'lucide-react'

interface SettingsGroup {
  label: string
  description: string
  icon: React.ElementType
  settings: {
    key: string
    value: string
    type: string
    description: string | null
  }[]
}

export function AdminSettingsPage() {
  const [settingsGroups, setSettingsGroups] = useState<Record<string, SettingsGroup>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Track modified values
  const [modifiedSettings, setModifiedSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        const groups = data.data ?? {}
        setSettingsGroups(groups)
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  function getSettingValue(group: string, key: string, fallback: string) {
    return modifiedSettings[`${group}.${key}`] ?? settingsGroups[group]?.settings.find(s => s.key === key)?.value ?? fallback
  }

  function setSettingValue(group: string, key: string, value: string) {
    setModifiedSettings(prev => ({ ...prev, [`${group}.${key}`]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const settingsToSave = Object.entries(modifiedSettings).map(([fullKey, value]) => {
        const [group, ...keyParts] = fullKey.split('.')
        return { key: keyParts.join('.'), value }
      })

      if (settingsToSave.length === 0) {
        toast.info('No changes to save')
        setSaving(false)
        return
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToSave }),
      })

      if (res.ok) {
        toast.success('Settings saved successfully')
        setModifiedSettings({})
        loadSettings()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save settings')
      }
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = Object.keys(modifiedSettings).length > 0

  const GROUP_ICONS: Record<string, React.ElementType> = {
    general: Globe,
    vedic: Sparkles,
    market: BarChart3,
    appearance: Palette,
  }

  const GROUP_DESCRIPTIONS: Record<string, string> = {
    general: 'Core platform settings and configuration',
    vedic: 'Vedic astrology calculation preferences',
    market: 'Market data display and trading settings',
    appearance: 'Theme and visual customization',
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold">Site Settings</h2>
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-48" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold">Site Settings</h2>
            <p className="text-sm text-muted-foreground">Manage platform configuration</p>
          </div>
        </div>
        <Button
          className={`bg-amber-600 hover:bg-amber-700 text-white ${hasChanges ? '' : 'opacity-50'}`}
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {hasChanges && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-2 py-3 text-sm text-amber-700 dark:text-amber-400">
            <Settings className="h-4 w-4" />
            You have {Object.keys(modifiedSettings).length} unsaved change{Object.keys(modifiedSettings).length > 1 ? 's' : ''}.
          </CardContent>
        </Card>
      )}

      {/* Settings Groups */}
      <div className="grid gap-6">
        {Object.entries(settingsGroups).map(([groupKey, group]) => {
          const GroupIcon = GROUP_ICONS[groupKey] ?? Settings
          return (
            <Card key={groupKey}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2">
                    <GroupIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{group.label}</CardTitle>
                    <CardDescription>
                      {GROUP_DESCRIPTIONS[groupKey] ?? group.description ?? ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        {formatSettingLabel(setting.key)}
                      </Label>
                      {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      )}
                    </div>
                    <div className="sm:w-64">
                      {setting.type === 'BOOLEAN' ? (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={getSettingValue(groupKey, setting.key, setting.value) === 'true'}
                            onCheckedChange={(checked) =>
                              setSettingValue(groupKey, setting.key, checked ? 'true' : 'false')
                            }
                          />
                          <span className="text-xs text-muted-foreground">
                            {getSettingValue(groupKey, setting.key, setting.value) === 'true' ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      ) : (
                        <Input
                          value={getSettingValue(groupKey, setting.key, setting.value)}
                          onChange={(e) => setSettingValue(groupKey, setting.key, e.target.value)}
                          className="h-9 text-sm"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}

        {Object.keys(settingsGroups).length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-sm font-medium text-muted-foreground">No settings found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Settings will appear here after they are created.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function formatSettingLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\./g, ' › ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

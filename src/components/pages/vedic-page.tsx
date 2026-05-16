'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Sparkles,
  Plus,
  Globe,
  Calendar,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
} from 'lucide-react'

interface VedicEvent {
  id: string
  name: string
  eventType: string
  planet: string | null
  startDate: string
  endDate: string | null
  description: string | null
  marketImpact: string
  impactStrength: string
  createdAt: string
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  ECLIPSE: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  RETROGRADE: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  TRANSIT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  CONJUNCTION: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const IMPACT_COLORS: Record<string, string> = {
  BULLISH: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  BEARISH: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  NEUTRAL: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
}

const STRENGTH_COLORS: Record<string, string> = {
  HIGH: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  MEDIUM: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  LOW: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
}

const IMPACT_ICONS: Record<string, React.ElementType> = {
  BULLISH: TrendingUp,
  BEARISH: TrendingDown,
  NEUTRAL: Minus,
}

export function VedicPage() {
  const [events, setEvents] = useState<VedicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    eventType: 'TRANSIT',
    planet: '',
    startDate: '',
    endDate: '',
    description: '',
    marketImpact: 'NEUTRAL',
    impactStrength: 'MEDIUM',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const res = await fetch('/api/vedic-events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.data ?? [])
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.planet?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || e.eventType === typeFilter
    return matchesSearch && matchesType
  })

  async function handleSubmit() {
    if (!formData.name || !formData.startDate) {
      toast.error('Please fill in the required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/vedic-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Vedic event created successfully')
        setDialogOpen(false)
        setFormData({
          name: '',
          eventType: 'TRANSIT',
          planet: '',
          startDate: '',
          endDate: '',
          description: '',
          marketImpact: 'NEUTRAL',
          impactStrength: 'MEDIUM',
        })
        loadEvents()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create event')
      }
    } catch {
      toast.error('Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold">Vedic Astrological Events</h2>
            <p className="text-sm text-muted-foreground">Upcoming celestial events affecting NEPSE</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Vedic Event</DialogTitle>
              <DialogDescription>
                Record a new astrological event and its predicted market impact.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Saturn Retrograde in Aquarius"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Event Type *</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(v) => setFormData({ ...formData, eventType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ECLIPSE">Eclipse</SelectItem>
                      <SelectItem value="RETROGRADE">Retrograde</SelectItem>
                      <SelectItem value="TRANSIT">Transit</SelectItem>
                      <SelectItem value="CONJUNCTION">Conjunction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Planet</Label>
                  <Input
                    placeholder="e.g., Saturn"
                    value={formData.planet}
                    onChange={(e) => setFormData({ ...formData, planet: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the event and its astrological significance..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Market Impact</Label>
                  <Select
                    value={formData.marketImpact}
                    onValueChange={(v) => setFormData({ ...formData, marketImpact: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BULLISH">Bullish</SelectItem>
                      <SelectItem value="BEARISH">Bearish</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Impact Strength</Label>
                  <Select
                    value={formData.impactStrength}
                    onValueChange={(v) => setFormData({ ...formData, impactStrength: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events or planets..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ECLIPSE">Eclipse</SelectItem>
            <SelectItem value="RETROGRADE">Retrograde</SelectItem>
            <SelectItem value="TRANSIT">Transit</SelectItem>
            <SelectItem value="CONJUNCTION">Conjunction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const ImpactIcon = IMPACT_ICONS[event.marketImpact] ?? Minus
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{event.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] shrink-0 ${EVENT_TYPE_COLORS[event.eventType] ?? ''}`}
                    >
                      {event.eventType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {event.planet && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {event.planet}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.startDate).toLocaleDateString()}
                      {event.endDate && ` — ${new Date(event.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-md p-1.5 ${IMPACT_COLORS[event.marketImpact] ?? ''}`}>
                        <ImpactIcon className="h-3.5 w-3.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${IMPACT_COLORS[event.marketImpact] ?? ''}`}
                      >
                        {event.marketImpact}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${STRENGTH_COLORS[event.impactStrength] ?? ''}`}
                    >
                      <Zap className="mr-1 h-2.5 w-2.5" />
                      {event.impactStrength}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-sm font-medium text-muted-foreground">No events found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {events.length === 0
                ? 'Add your first vedic event to get started.'
                : 'Try adjusting your search or filter.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

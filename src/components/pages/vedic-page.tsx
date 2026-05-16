'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Compass,
  Star,
} from 'lucide-react'
import { KundliChart } from '@/components/vedic/kundli-chart'

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
  const [activeTab, setActiveTab] = useState('chart')

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

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    try {
      const res = await fetch('/api/vedic-events?all=true')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.data ?? [])
      }
    } catch { /* Silent fail */ } finally { setLoading(false) }
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
        setFormData({ name: '', eventType: 'TRANSIT', planet: '', startDate: '', endDate: '', description: '', marketImpact: 'NEUTRAL', impactStrength: 'MEDIUM' })
        loadEvents()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create event')
      }
    } catch { toast.error('Failed to create event') } finally { setSubmitting(false) }
  }

  // Impact summary stats
  const impactCounts = {
    bullish: events.filter(e => e.marketImpact === 'BULLISH').length,
    bearish: events.filter(e => e.marketImpact === 'BEARISH').length,
    neutral: events.filter(e => e.marketImpact === 'NEUTRAL').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold">Vedic Astrology Center</h2>
            <p className="text-sm text-muted-foreground">Kundli charts, celestial events, and market predictions</p>
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
              <DialogDescription>Record a new astrological event and its predicted market impact.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input id="name" placeholder="e.g., Saturn Retrograde in Aquarius" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Event Type *</Label>
                  <Select value={formData.eventType} onValueChange={(v) => setFormData({ ...formData, eventType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Input placeholder="e.g., Saturn" value={formData.planet} onChange={(e) => setFormData({ ...formData, planet: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the event and its astrological significance..." rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Market Impact</Label>
                  <Select value={formData.marketImpact} onValueChange={(v) => setFormData({ ...formData, marketImpact: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BULLISH">Bullish</SelectItem>
                      <SelectItem value="BEARISH">Bearish</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Impact Strength</Label>
                  <Select value={formData.impactStrength} onValueChange={(v) => setFormData({ ...formData, impactStrength: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart" className="gap-2">
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Kundli Chart</span>
            <span className="sm:hidden">Chart</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
            <span className="sm:hidden">Events</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Impact Analysis</span>
            <span className="sm:hidden">Impact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-6">
          <KundliChart />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search events or planets..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Event Type" /></SelectTrigger>
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
                  <Card key={i}><CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
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
                          <Badge variant="secondary" className={`text-[10px] shrink-0 ${EVENT_TYPE_COLORS[event.eventType] ?? ''}`}>{event.eventType}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {event.planet && (<span className="flex items-center gap-1"><Globe className="h-3 w-3" />{event.planet}</span>)}
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.startDate).toLocaleDateString()}{event.endDate && ` — ${new Date(event.endDate).toLocaleDateString()}`}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {event.description && <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-md p-1.5 ${IMPACT_COLORS[event.marketImpact] ?? ''}`}><ImpactIcon className="h-3.5 w-3.5" /></div>
                            <Badge variant="outline" className={`text-[10px] ${IMPACT_COLORS[event.marketImpact] ?? ''}`}>{event.marketImpact}</Badge>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${STRENGTH_COLORS[event.impactStrength] ?? ''}`}><Zap className="mr-1 h-2.5 w-2.5" />{event.impactStrength}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card><CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-medium text-muted-foreground">No events found</h3>
                <p className="text-xs text-muted-foreground mt-1">{events.length === 0 ? 'Add your first vedic event to get started.' : 'Try adjusting your search or filter.'}</p>
              </CardContent></Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Bullish Events</CardTitle>
                  <div className="rounded-lg bg-emerald-500/10 p-2"><TrendingUp className="h-4 w-4 text-emerald-600" /></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{impactCounts.bullish}</div>
                <div className="mt-3 space-y-2">
                  {events.filter(e => e.marketImpact === 'BULLISH').slice(0, 3).map(e => (
                    <div key={e.id} className="flex items-center justify-between text-sm">
                      <span className="truncate mr-2">{e.name}</span>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${STRENGTH_COLORS[e.impactStrength] ?? ''}`}>{e.impactStrength}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Bearish Events</CardTitle>
                  <div className="rounded-lg bg-rose-500/10 p-2"><TrendingDown className="h-4 w-4 text-rose-600" /></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-600">{impactCounts.bearish}</div>
                <div className="mt-3 space-y-2">
                  {events.filter(e => e.marketImpact === 'BEARISH').slice(0, 3).map(e => (
                    <div key={e.id} className="flex items-center justify-between text-sm">
                      <span className="truncate mr-2">{e.name}</span>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${STRENGTH_COLORS[e.impactStrength] ?? ''}`}>{e.impactStrength}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Neutral Events</CardTitle>
                  <div className="rounded-lg bg-slate-500/10 p-2"><Minus className="h-4 w-4 text-slate-600" /></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-600">{impactCounts.neutral}</div>
                <div className="mt-3 space-y-2">
                  {events.filter(e => e.marketImpact === 'NEUTRAL').slice(0, 3).map(e => (
                    <div key={e.id} className="flex items-center justify-between text-sm">
                      <span className="truncate mr-2">{e.name}</span>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${STRENGTH_COLORS[e.impactStrength] ?? ''}`}>{e.impactStrength}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Market Sentiment */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Overall Astrological Market Sentiment</CardTitle>
              <CardDescription>Combined signal based on all active vedic events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-4 flex-1 bg-muted rounded-full overflow-hidden flex">
                      {events.length > 0 && (
                        <>
                          <div className="bg-emerald-500 transition-all" style={{ width: `${(impactCounts.bullish / events.length) * 100}%` }} />
                          <div className="bg-rose-500 transition-all" style={{ width: `${(impactCounts.bearish / events.length) * 100}%` }} />
                          <div className="bg-slate-300 transition-all" style={{ width: `${(impactCounts.neutral / events.length) * 100}%` }} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Bullish ({impactCounts.bullish})</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500" /> Bearish ({impactCounts.bearish})</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-300" /> Neutral ({impactCounts.neutral})</div>
                  </div>
                </div>
                <div className="text-center px-6">
                  <Badge variant="outline" className={`text-sm px-4 py-2 ${
                    impactCounts.bullish > impactCounts.bearish
                      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400'
                      : impactCounts.bearish > impactCounts.bullish
                        ? 'bg-rose-500/10 text-rose-700 border-rose-200 dark:text-rose-400'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {impactCounts.bullish > impactCounts.bearish ? 'BULLISH' : impactCounts.bearish > impactCounts.bullish ? 'BEARISH' : 'NEUTRAL'}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">Signal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

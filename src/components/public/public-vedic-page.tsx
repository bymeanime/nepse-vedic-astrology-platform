'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, TrendingUp, TrendingDown, Minus, Zap, Globe, Calendar, Star } from 'lucide-react'
import { KundliChart } from '@/components/vedic/kundli-chart'
import { useAppStore } from '@/lib/store'

interface VedicEvent {
  id: string; name: string; eventType: string; planet: string | null
  startDate: string; endDate: string | null; description: string | null
  marketImpact: string; impactStrength: string
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

const IMPACT_ICONS: Record<string, React.ElementType> = { BULLISH: TrendingUp, BEARISH: TrendingDown, NEUTRAL: Minus }

export function PublicVedicPage() {
  const [events, setEvents] = useState<VedicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { setPublicPage } = useAppStore()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/vedic-events')
        if (res.ok) { const data = await res.json(); setEvents(data.data ?? []) }
      } catch { /* Silent */ } finally { setLoading(false) }
    }
    load()
  }, [])

  const impactCounts = {
    bullish: events.filter(e => e.marketImpact === 'BULLISH').length,
    bearish: events.filter(e => e.marketImpact === 'BEARISH').length,
    neutral: events.filter(e => e.marketImpact === 'NEUTRAL').length,
  }

  const overallSignal = impactCounts.bullish > impactCounts.bearish ? 'BULLISH' : impactCounts.bearish > impactCounts.bullish ? 'BEARISH' : 'NEUTRAL'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <Badge variant="outline" className="text-[10px] border-amber-300/30 text-amber-200 bg-amber-500/10">
              Vedic Astrology
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">Vedic Insights & Kundli Charts</h1>
          <p className="text-violet-200 mt-1">Explore planetary positions, Dasha periods, and their market impact</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Sentiment Banner */}
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Current Astrological Market Signal</h3>
                <p className="text-xs text-muted-foreground mt-1">Based on {events.length} active vedic events</p>
              </div>
              <Badge variant="outline" className={`text-sm px-4 py-1.5 ${
                overallSignal === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400'
                  : overallSignal === 'BEARISH' ? 'bg-rose-500/10 text-rose-700 border-rose-200 dark:text-rose-400'
                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {overallSignal === 'BULLISH' ? '▲' : overallSignal === 'BEARISH' ? '▼' : '—'} {overallSignal}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Kundli Chart */}
        <KundliChart />

        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-600" /> Upcoming Celestial Events
          </h2>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const ImpactIcon = IMPACT_ICONS[event.marketImpact] ?? Minus
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-foreground leading-tight">{event.name}</h3>
                        <Badge variant="secondary" className={`text-[10px] shrink-0 ${EVENT_TYPE_COLORS[event.eventType] ?? ''}`}>{event.eventType}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {event.planet && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{event.planet}</span>}
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      {event.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{event.description}</p>}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-md p-1.5 ${IMPACT_COLORS[event.marketImpact] ?? ''}`}><ImpactIcon className="h-3.5 w-3.5" /></div>
                          <span className="text-xs font-medium">{event.marketImpact}</span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${event.impactStrength === 'HIGH' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400' : event.impactStrength === 'MEDIUM' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
                          <Zap className="h-2.5 w-2.5 mr-0.5" />{event.impactStrength}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

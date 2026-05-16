'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Brain,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Link2,
  Sparkles,
} from 'lucide-react'

interface Prediction {
  id: string
  vedicEventId: string
  stockId: string | null
  predictionType: string
  prediction: string
  confidence: number
  reasoning: string | null
  targetDate: string
  actualOutcome: string | null
  createdAt: string
  vedicEvent: { id: string; name: string; eventType: string } | null
  stock: { id: string; symbol: string; name: string } | null
}

interface VedicEvent {
  id: string
  name: string
  eventType: string
}

const PREDICTION_COLORS: Record<string, string> = {
  BULLISH: 'text-emerald-600',
  BEARISH: 'text-rose-600',
  NEUTRAL: 'text-slate-500',
}

const PREDICTION_BG: Record<string, string> = {
  BULLISH: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  BEARISH: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  NEUTRAL: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
}

const PREDICTION_ICONS: Record<string, React.ElementType> = {
  BULLISH: TrendingUp,
  BEARISH: TrendingDown,
  NEUTRAL: Minus,
}

const TYPE_COLORS: Record<string, string> = {
  DAILY: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  WEEKLY: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  MONTHLY: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
}

export function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [vedicEvents, setVedicEvents] = useState<VedicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    vedicEventId: '',
    stockId: '',
    predictionType: 'DAILY',
    prediction: 'NEUTRAL',
    confidence: '50',
    reasoning: '',
    targetDate: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [predRes, vedicRes] = await Promise.allSettled([
        fetch('/api/predictions'),
        fetch('/api/vedic-events'),
      ])

      if (predRes.status === 'fulfilled' && predRes.value.ok) {
        const data = await predRes.value.json()
        setPredictions(data.data ?? [])
      }
      if (vedicRes.status === 'fulfilled' && vedicRes.value.ok) {
        const data = await vedicRes.value.json()
        setVedicEvents(data.data ?? [])
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const filteredPredictions = predictions.filter((p) => {
    const matchesSearch =
      p.vedicEvent?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stock?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stock?.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || p.predictionType === typeFilter
    return matchesSearch && matchesType
  })

  async function handleSubmit() {
    if (!formData.vedicEventId || !formData.targetDate) {
      toast.error('Please fill in the required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          confidence: parseInt(formData.confidence, 10),
          stockId: formData.stockId || null,
        }),
      })

      if (res.ok) {
        toast.success('Prediction created successfully')
        setDialogOpen(false)
        setFormData({
          vedicEventId: '',
          stockId: '',
          predictionType: 'DAILY',
          prediction: 'NEUTRAL',
          confidence: '50',
          reasoning: '',
          targetDate: '',
        })
        loadData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create prediction')
      }
    } catch {
      toast.error('Failed to create prediction')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold">Market Predictions</h2>
            <p className="text-sm text-muted-foreground">
              Vedic-based market predictions and analysis
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Prediction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Prediction</DialogTitle>
              <DialogDescription>
                Add a new market prediction linked to a vedic event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Vedic Event *</Label>
                <Select
                  value={formData.vedicEventId}
                  onValueChange={(v) => setFormData({ ...formData, vedicEventId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {vedicEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type *</Label>
                  <Select
                    value={formData.predictionType}
                    onValueChange={(v) => setFormData({ ...formData, predictionType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Prediction *</Label>
                  <Select
                    value={formData.prediction}
                    onValueChange={(v) => setFormData({ ...formData, prediction: v })}
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
              </div>
              <div className="grid gap-2">
                <Label>Confidence: {formData.confidence}%</Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.confidence}
                  onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                  className="cursor-pointer"
                />
              </div>
              <div className="grid gap-2">
                <Label>Target Date *</Label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Reasoning</Label>
                <Textarea
                  placeholder="Explain the reasoning behind this prediction..."
                  rows={3}
                  value={formData.reasoning}
                  onChange={(e) => setFormData({ ...formData, reasoning: e.target.value })}
                />
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
                {submitting ? 'Creating...' : 'Create Prediction'}
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
            placeholder="Search predictions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead className="hidden md:table-cell">Confidence</TableHead>
                  <TableHead className="hidden lg:table-cell">Vedic Event</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-2 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredPredictions.length > 0 ? (
                  filteredPredictions.map((p) => {
                    const PredIcon = PREDICTION_ICONS[p.prediction] ?? Minus
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="text-sm">
                          {new Date(p.targetDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${TYPE_COLORS[p.predictionType] ?? ''}`}
                          >
                            {p.predictionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`rounded-md p-1 ${PREDICTION_BG[p.prediction] ?? ''}`}>
                              <PredIcon className="h-3 w-3" />
                            </div>
                            <span className={`text-sm font-medium ${PREDICTION_COLORS[p.prediction] ?? ''}`}>
                              {p.prediction}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Progress
                              value={p.confidence}
                              className={`h-2 ${
                                p.confidence >= 70
                                  ? '[&>div]:bg-emerald-500'
                                  : p.confidence >= 40
                                    ? '[&>div]:bg-amber-500'
                                    : '[&>div]:bg-rose-500'
                              }`}
                            />
                            <span className="text-xs font-medium text-muted-foreground w-8">
                              {p.confidence}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {p.vedicEvent && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              <span className="truncate max-w-[150px]">{p.vedicEvent.name}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {p.stock && (
                            <Badge variant="outline" className="text-[10px]">
                              {p.stock.symbol}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                      <Brain className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                      {predictions.length === 0
                        ? 'No predictions yet. Create your first prediction.'
                        : 'No predictions match your search.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

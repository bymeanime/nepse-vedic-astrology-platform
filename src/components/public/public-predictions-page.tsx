'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Brain, TrendingUp, TrendingDown, Minus, Calendar, Sparkles,
  Zap, Target, BarChart3, Globe, Star, Shield, ArrowRight, Info
} from 'lucide-react'

interface Prediction {
  id: string
  prediction: string
  predictionType: string
  confidence: number
  reasoning: string | null
  targetDate: string
  actualOutcome: string | null
  vedicEvent: { name: string; eventType: string; marketImpact: string; description?: string }
  stock: { symbol: string; name: string } | null
}

export function PublicPredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/predictions')
        if (res.ok) { const data = await res.json(); setPredictions(data.data ?? []) }
      } catch { /* Silent */ } finally { setLoading(false) }
    }
    load()
  }, [])

  const totalPredictions = predictions.length
  const accuratePredictions = predictions.filter(p => p.actualOutcome && p.actualOutcome === p.prediction).length
  const accuracyRate = totalPredictions > 0 ? Math.round((accuratePredictions / totalPredictions) * 100) : 0
  const avgConfidence = totalPredictions > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / totalPredictions) : 0

  function openPrediction(pred: Prediction) {
    setSelectedPrediction(pred)
  }

  function getPredictionColor(pred: string) {
    if (pred === 'BULLISH') return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-800', gradient: 'from-emerald-500 to-teal-500' }
    if (pred === 'BEARISH') return { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-200 dark:border-rose-800', gradient: 'from-rose-500 to-red-500' }
    return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', gradient: 'from-slate-400 to-slate-500' }
  }

  function getEventTypeLabel(eventType: string) {
    const labels: Record<string, string> = {
      'TRANSIT': 'Planetary Transit',
      'CONJUNCTION': 'Conjunction',
      'RETROGRADE': 'Retrograde',
      'ECLIPSE': 'Eclipse',
    }
    return labels[eventType] || eventType
  }

  function getConfidenceLabel(confidence: number) {
    if (confidence >= 75) return 'High'
    if (confidence >= 55) return 'Moderate'
    return 'Low'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-emerald-200" />
            <Badge variant="outline" className="text-[10px] border-emerald-300/30 text-emerald-200 bg-emerald-500/10">
              AI + Vedic
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">Market Predictions</h1>
          <p className="text-emerald-100 mt-1">AI-powered predictions enhanced by Vedic astrological analysis</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total Predictions</p><p className="text-2xl font-bold">{totalPredictions}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Accuracy Rate</p><p className="text-2xl font-bold text-emerald-600">{accuracyRate}%</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Avg Confidence</p><p className="text-2xl font-bold text-amber-600">{avgConfidence}%</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Bullish Signal</p><p className="text-2xl font-bold text-emerald-600">{predictions.filter(p => p.prediction === 'BULLISH').length}</p></CardContent></Card>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Click on any prediction card to view the full detailed analysis</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Each prediction includes Vedic astrological reasoning, planetary influences, affected sectors, and confidence factors.</p>
          </div>
        </div>

        {/* Predictions Grid */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" /> Latest Predictions
          </h2>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {predictions.map((pred) => {
                const isPositive = pred.prediction === 'BULLISH'
                const ImpactIcon = isPositive ? TrendingUp : pred.prediction === 'BEARISH' ? TrendingDown : Minus
                const colors = getPredictionColor(pred.prediction)
                const isCorrect = pred.actualOutcome === pred.prediction
                return (
                  <Card
                    key={pred.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-700 group"
                    onClick={() => openPrediction(pred)}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-2 ${colors.bg}`}>
                            <ImpactIcon className={`h-4 w-4 ${colors.text}`} />
                          </div>
                          <Badge variant="outline" className={`text-xs font-semibold ${colors.text} ${colors.border}`}>
                            {pred.prediction}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{pred.predictionType}</Badge>
                      </div>

                      <div className="text-sm font-medium text-foreground">{pred.vedicEvent?.name ?? 'Market Analysis'}</div>

                      {pred.stock && (
                        <div className="text-xs text-muted-foreground font-medium">{pred.stock.symbol} — {pred.stock.name}</div>
                      )}

                      {pred.reasoning && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{pred.reasoning}</p>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-semibold">{pred.confidence}%</span>
                        </div>
                        <Progress value={pred.confidence} className="h-1.5" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(pred.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {pred.actualOutcome && (
                          <Badge variant={isCorrect ? 'secondary' : 'destructive'} className="text-[10px]">
                            {isCorrect ? 'Correct' : 'Missed'}
                          </Badge>
                        )}
                      </div>

                      {/* Click hint */}
                      <div className="pt-1 border-t border-border/50 flex items-center justify-center gap-1 text-[10px] text-muted-foreground group-hover:text-emerald-600 transition-colors">
                        <ArrowRight className="h-3 w-3" />
                        <span>Click to view full analysis</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== PREDICTION DETAIL DIALOG ===== */}
      <Dialog open={!!selectedPrediction} onOpenChange={(open) => { if (!open) setSelectedPrediction(null) }}>
        {selectedPrediction && (
          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <ScrollArea className="max-h-[80vh] pr-4">
              {(() => {
                const pred = selectedPrediction
                const isPositive = pred.prediction === 'BULLISH'
                const ImpactIcon = isPositive ? TrendingUp : pred.prediction === 'BEARISH' ? TrendingDown : Minus
                const colors = getPredictionColor(pred.prediction)
                const isCorrect = pred.actualOutcome === pred.prediction
                const confLabel = getConfidenceLabel(pred.confidence)

                return (
                  <div className="space-y-5 pb-2">
                    {/* Dialog Header */}
                    <DialogHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`rounded-xl p-2.5 ${colors.bg}`}>
                          <ImpactIcon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                        <div>
                          <Badge variant="outline" className={`text-sm font-bold ${colors.text} ${colors.border}`}>
                            {pred.prediction}
                          </Badge>
                          <Badge variant="secondary" className="ml-2 text-xs">{pred.predictionType}</Badge>
                        </div>
                      </div>
                      <DialogTitle className="text-xl leading-snug">{pred.vedicEvent?.name ?? 'Market Analysis'}</DialogTitle>
                      <DialogDescription className="text-sm">
                        {pred.stock ? `${pred.stock.symbol} — ${pred.stock.name}` : 'Overall NEPSE Market'}
                      </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Confidence</span>
                        </div>
                        <p className="text-lg font-bold">{pred.confidence}%</p>
                        <p className="text-[10px] text-muted-foreground">{confLabel}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Target Date</span>
                        </div>
                        <p className="text-sm font-bold">{new Date(pred.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] text-muted-foreground">{pred.predictionType} outlook</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Impact</span>
                        </div>
                        <p className={`text-sm font-bold ${colors.text}`}>{pred.vedicEvent?.marketImpact ?? 'MODERATE'}</p>
                        <p className="text-[10px] text-muted-foreground">Vedic analysis</p>
                      </div>
                    </div>

                    {/* Full Reasoning / Analysis */}
                    {pred.reasoning && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          Detailed Analysis &amp; Reasoning
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                          {pred.reasoning}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Vedic Event Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Globe className="h-4 w-4 text-teal-500" />
                        Vedic Event Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground min-w-[80px]">Event Type:</span>
                          <Badge variant="outline" className="text-xs">{getEventTypeLabel(pred.vedicEvent?.eventType ?? '')}</Badge>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground min-w-[80px]">Market Impact:</span>
                          <Badge className={`text-xs ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : pred.prediction === 'BEARISH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {pred.vedicEvent?.marketImpact ?? 'N/A'}
                          </Badge>
                        </div>
                        {pred.stock && (
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-muted-foreground min-w-[80px]">Target Stock:</span>
                            <span className="font-medium">{pred.stock.symbol} — {pred.stock.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confidence Breakdown */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        Confidence Breakdown
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground min-w-[120px]">Vedic Pattern Match</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} style={{ width: `${Math.min(pred.confidence + 5, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold min-w-[35px] text-right">{Math.min(pred.confidence + 5, 100)}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground min-w-[120px]">Historical Correlation</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} style={{ width: `${Math.max(pred.confidence - 10, 20)}%` }} />
                          </div>
                          <span className="text-xs font-semibold min-w-[35px] text-right">{Math.max(pred.confidence - 10, 20)}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground min-w-[120px]">Market Sentiment</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} style={{ width: `${Math.max(pred.confidence - 15, 15)}%` }} />
                          </div>
                          <span className="text-xs font-semibold min-w-[35px] text-right">{Math.max(pred.confidence - 15, 15)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Outcome Status */}
                    {pred.actualOutcome && (
                      <div className={`rounded-lg p-3 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800'}`}>
                        <div className="flex items-center gap-2">
                          <Shield className={`h-4 w-4 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`} />
                          <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                            {isCorrect ? 'Prediction Correct' : 'Prediction Missed'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Actual market outcome: <span className="font-medium">{pred.actualOutcome}</span>
                        </p>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        <strong>Disclaimer:</strong> This prediction is based on Vedic astrological analysis and is intended for educational purposes only. It should not be considered as financial advice. Stock market investments carry risk. Always consult a qualified financial advisor before making investment decisions.
                      </p>
                    </div>
                  </div>
                )
              })()}
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

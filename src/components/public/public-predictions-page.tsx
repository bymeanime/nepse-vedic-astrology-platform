'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Brain, TrendingUp, TrendingDown, Minus, Calendar, Sparkles, Zap } from 'lucide-react'

interface Prediction {
  id: string
  prediction: string
  predictionType: string
  confidence: number
  reasoning: string | null
  targetDate: string
  actualOutcome: string | null
  vedicEvent: { name: string; eventType: string; marketImpact: string }
  stock: { symbol: string; name: string } | null
}

export function PublicPredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
          <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Bullish Signal</p><p className="text-2xl font-bold">{predictions.filter(p => p.prediction === 'BULLISH').length}</p></CardContent></Card>
        </div>

        {/* Predictions List */}
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
                const isCorrect = pred.actualOutcome === pred.prediction
                return (
                  <Card key={pred.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-2 ${isPositive ? 'bg-emerald-500/10' : pred.prediction === 'BEARISH' ? 'bg-rose-500/10' : 'bg-slate-100'}`}>
                            <ImpactIcon className={`h-4 w-4 ${isPositive ? 'text-emerald-600' : pred.prediction === 'BEARISH' ? 'text-rose-600' : 'text-slate-600'}`} />
                          </div>
                          <Badge variant="outline" className={`text-xs font-semibold ${isPositive ? 'text-emerald-600 border-emerald-200 dark:border-emerald-800' : pred.prediction === 'BEARISH' ? 'text-rose-600 border-rose-200 dark:border-rose-800' : 'text-slate-600'}`}>
                            {pred.prediction}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{pred.predictionType}</Badge>
                      </div>

                      <div className="text-sm font-medium text-foreground">{pred.vedicEvent?.name ?? 'Market Analysis'}</div>

                      {pred.stock && (
                        <div className="text-xs text-muted-foreground">{pred.stock.symbol} — {pred.stock.name}</div>
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
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(pred.targetDate).toLocaleDateString()}</span>
                        {pred.actualOutcome && (
                          <Badge variant={isCorrect ? 'secondary' : 'destructive'} className="text-[10px]">
                            {isCorrect ? 'Correct' : 'Missed'}
                          </Badge>
                        )}
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

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { TrendingUp, TrendingDown, Search, BarChart3, Sparkles } from 'lucide-react'
import { MiniChart } from '@/components/charts/mini-chart'
import { KundliChart } from '@/components/vedic/kundli-chart'

interface MarketIndex {
  id: string; name: string; value: number; change: number; changePercent: number; volume: number; date: string
}

interface Stock {
  id: string; symbol: string; name: string; sector: string | null; isActive: boolean
  prices: { close: number; date: string }[]
}

const SECTOR_COLORS: Record<string, string> = {
  'Commercial Banks': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Development Banks': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Life Insurance': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  'Insurance': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  'Manufacturing': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  'Hydropower': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Finance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
}

const INDEX_DESCRIPTIONS: Record<string, string> = {
  NEPSE: 'Nepal Stock Exchange Composite Index',
  Sensitive: 'Sensitive Index (Top Companies)',
  Float: 'Float Index (Publicly Traded Shares)',
}

export function PublicMarketPage() {
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [marketRes, stocksRes] = await Promise.allSettled([fetch('/api/market'), fetch('/api/stocks')])
        if (marketRes.status === 'fulfilled' && marketRes.value.ok) {
          const data = await marketRes.value.json()
          setIndices(data.data ?? [])
        }
        if (stocksRes.status === 'fulfilled' && stocksRes.value.ok) {
          const data = await stocksRes.value.json()
          setStocks(data.data ?? [])
        }
      } catch { /* Silent */ } finally { setLoading(false) }
    }
    loadData()
  }, [])

  const filteredStocks = stocks.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sector?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-6 w-6 text-white/80" />
            <Badge variant="outline" className="text-[10px] border-white/30 text-white/80 bg-white/10">
              Live Data
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">NEPSE Market Overview</h1>
          <p className="text-amber-100 mt-1">Real-time Nepal Stock Exchange data with astrological insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Index Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            : indices.map((index) => {
                const isPositive = index.change >= 0
                return (
                  <Card key={index.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{INDEX_DESCRIPTIONS[index.name] ?? index.name}</CardTitle>
                        <div className={`rounded-lg p-1.5 ${isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                          {isPositive ? <TrendingUp className="h-4 w-4 text-emerald-600" /> : <TrendingDown className="h-4 w-4 text-rose-600" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{index.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? '+' : ''}{index.change.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${isPositive ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'}`}>
                          {isPositive ? '▲' : '▼'} {Math.abs(index.changePercent).toFixed(2)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
        </div>

        {/* Stock Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-amber-600" /> Stock List</CardTitle>
                <CardDescription>{filteredStocks.length} stocks tracked</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search stocks..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Sector</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="hidden lg:table-cell w-24">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <TableRow key={stock.id} className="hover:bg-muted/50">
                        <TableCell className="font-semibold text-amber-700 dark:text-amber-400">{stock.symbol}</TableCell>
                        <TableCell className="text-sm">{stock.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {stock.sector && <Badge variant="secondary" className={`text-[10px] ${SECTOR_COLORS[stock.sector] ?? 'bg-slate-100 text-slate-800'}`}>{stock.sector}</Badge>}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {stock.prices?.[0]?.close ? `Rs. ${stock.prices[0].close.toLocaleString()}` : 'N/A'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex justify-end"><MiniChart prices={stock.prices} positive={stock.prices?.[0]?.close >= (stock.prices?.[1]?.close ?? stock.prices?.[0]?.close)} /></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">No stocks found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

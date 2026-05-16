'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bookmark, BookmarkCheck, Search, Star, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface WatchlistItem {
  id: string
  watchlistId: string
  stock: {
    id: string
    symbol: string
    name: string
    sector: string | null
    prices: { close: number; date: string }[]
  }
}

interface Watchlist {
  id: string
  name: string
  createdAt: string
  _count?: { items: number }
}

interface StockOption {
  id: string
  symbol: string
  name: string
  sector: string | null
}

export function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [activeWatchlist, setActiveWatchlist] = useState<string>('')
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [allStocks, setAllStocks] = useState<StockOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [addStockDialogOpen, setAddStockDialogOpen] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')
  const [selectedStockId, setSelectedStockId] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteWatchlistId, setDeleteWatchlistId] = useState('')

  const loadWatchlists = useCallback(async () => {
    try {
      const res = await fetch('/api/watchlist')
      if (res.ok) {
        const data = await res.json()
        setWatchlists(data.data ?? [])
        if (!activeWatchlist && data.data?.length > 0) {
          setActiveWatchlist(data.data[0].id)
        }
      }
    } catch {
      toast.error('Failed to load watchlists')
    } finally {
      setLoading(false)
    }
  }, [activeWatchlist])

  const loadItems = useCallback(async (watchlistId: string) => {
    if (!watchlistId) return
    try {
      const res = await fetch(`/api/watchlist/${watchlistId}/items`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.data ?? [])
      }
    } catch {
      // Silent fail
    }
  }, [])

  const loadAllStocks = useCallback(async () => {
    try {
      const res = await fetch('/api/stocks')
      if (res.ok) {
        const data = await res.json()
        setAllStocks(data.data ?? [])
      }
    } catch {
      // Silent fail
    }
  }, [])

  useEffect(() => {
    loadWatchlists()
    loadAllStocks()
  }, [loadWatchlists, loadAllStocks])

  useEffect(() => {
    if (activeWatchlist) {
      loadItems(activeWatchlist)
    }
  }, [activeWatchlist, loadItems])

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      toast.error('Please enter a watchlist name')
      return
    }
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWatchlistName.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setCreateDialogOpen(false)
        setNewWatchlistName('')
        toast.success('Watchlist created')
        loadWatchlists()
        setActiveWatchlist(data.data?.id ?? '')
      } else {
        const err = await res.json()
        toast.error(err.error?.message ?? 'Failed to create watchlist')
      }
    } catch {
      toast.error('Failed to create watchlist')
    }
  }

  const handleAddStock = async () => {
    if (!selectedStockId) {
      toast.error('Please select a stock')
      return
    }
    try {
      const res = await fetch(`/api/watchlist/${activeWatchlist}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockId: selectedStockId }),
      })
      if (res.ok) {
        setAddStockDialogOpen(false)
        setSelectedStockId('')
        toast.success('Stock added to watchlist')
        loadItems(activeWatchlist)
      } else {
        const err = await res.json()
        toast.error(err.error?.message ?? 'Failed to add stock')
      }
    } catch {
      toast.error('Failed to add stock')
    }
  }

  const handleRemoveStock = async (watchlistItemId: string) => {
    try {
      const res = await fetch(`/api/watchlist/${activeWatchlist}/items/${watchlistItemId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Stock removed from watchlist')
        loadItems(activeWatchlist)
      } else {
        toast.error('Failed to remove stock')
      }
    } catch {
      toast.error('Failed to remove stock')
    }
  }

  const handleDeleteWatchlist = async () => {
    try {
      const res = await fetch(`/api/watchlist/${deleteWatchlistId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setDeleteDialogOpen(false)
        toast.success('Watchlist deleted')
        if (activeWatchlist === deleteWatchlistId) {
          setActiveWatchlist('')
          setItems([])
        }
        loadWatchlists()
      } else {
        toast.error('Failed to delete watchlist')
      }
    } catch {
      toast.error('Failed to delete watchlist')
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableStocks = allStocks.filter(
    (s) => !items.some((i) => i.stock.id === s.id)
  )

  const getPriceChange = (item: WatchlistItem) => {
    const prices = item.stock.prices
    if (prices.length >= 2) {
      return prices[0].close - prices[1].close
    }
    return 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-amber-600" />
            Watchlist
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your favorite NEPSE stocks and monitor their performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Watchlist
          </Button>
          {activeWatchlist && (
            <Button variant="outline" onClick={() => setAddStockDialogOpen(true)}>
              <Star className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          )}
        </div>
      </div>

      {/* Watchlist Tabs */}
      <div className="flex gap-2 flex-wrap">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))
        ) : watchlists.length > 0 ? (
          watchlists.map((wl) => (
            <div key={wl.id} className="flex items-center gap-1">
              <Button
                key={wl.id}
                variant={activeWatchlist === wl.id ? 'default' : 'outline'}
                className={
                  activeWatchlist === wl.id
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : ''
                }
                onClick={() => setActiveWatchlist(wl.id)}
              >
                <BookmarkCheck className="h-4 w-4 mr-2" />
                {wl.name}
                <Badge variant="secondary" className="ml-2 text-[10px] bg-white/20">
                  {wl._count?.items ?? 0}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-rose-600"
                onClick={() => {
                  setDeleteWatchlistId(wl.id)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground py-2">
            No watchlists yet. Create one to start tracking stocks.
          </div>
        )}
      </div>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Tracked Stocks</CardTitle>
              <CardDescription>{filteredItems.length} stocks in this watchlist</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!activeWatchlist ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select or create a watchlist to start tracking stocks</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Sector</TableHead>
                    <TableHead className="text-right">Latest Price</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Change</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const change = getPriceChange(item)
                    const isPositive = change >= 0
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-semibold text-amber-700 dark:text-amber-400">
                          {item.stock.symbol}
                        </TableCell>
                        <TableCell className="text-sm">{item.stock.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.stock.sector && (
                            <Badge variant="secondary" className="text-[10px]">
                              {item.stock.sector}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.stock.prices?.[0]?.close
                            ? `Rs. ${item.stock.prices[0].close.toLocaleString()}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <span
                            className={`text-sm font-semibold ${
                              isPositive ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {change.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            onClick={() => handleRemoveStock(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {items.length === 0
                  ? 'This watchlist is empty. Add stocks to start tracking.'
                  : 'No stocks match your search.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Watchlist Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Watchlist</DialogTitle>
            <DialogDescription>
              Give your watchlist a name to organize your tracked stocks.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g., My Top Picks, Banking Sector, Dividend Stocks"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateWatchlist()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWatchlist}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stock Dialog */}
      <Dialog open={addStockDialogOpen} onOpenChange={setAddStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock to Watchlist</DialogTitle>
            <DialogDescription>
              Select a stock to add to your current watchlist.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedStockId} onValueChange={setSelectedStockId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a stock..." />
            </SelectTrigger>
            <SelectContent>
              {availableStocks.map((stock) => (
                <SelectItem key={stock.id} value={stock.id}>
                  {stock.symbol} — {stock.name}
                  {stock.sector ? ` (${stock.sector})` : ''}
                </SelectItem>
              ))}
              {availableStocks.length === 0 && (
                <SelectItem value="none" disabled>
                  All stocks are already in this watchlist
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddStock}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Watchlist Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this watchlist? All tracked stocks will be removed.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWatchlist}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

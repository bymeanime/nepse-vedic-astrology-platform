'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, Star, Compass } from 'lucide-react'

const HOUSES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const
const HOUSE_SYMBOLS = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'] as const
const HOUSE_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const
const NAVagraha = [
  { name: 'Sun', symbol: 'Su', color: '#F59E0B', house: 4 },
  { name: 'Moon', symbol: 'Mo', color: '#94A3B8', house: 10 },
  { name: 'Mars', symbol: 'Ma', color: '#EF4444', house: 1 },
  { name: 'Mercury', symbol: 'Me', color: '#22C55E', house: 7 },
  { name: 'Jupiter', symbol: 'Ju', color: '#F97316', house: 3 },
  { name: 'Venus', symbol: 'Ve', color: '#EC4899', house: 9 },
  { name: 'Saturn', symbol: 'Sa', color: '#6366F1', house: 11 },
  { name: 'Rahu', symbol: 'Ra', color: '#8B5CF6', house: 6 },
  { name: 'Ketu', symbol: 'Ke', color: '#78716C', house: 12 },
] as const

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
] as const

const DASHA_PERIODS = [
  { planet: 'Ketu', years: 7, remaining: 2 },
  { planet: 'Venus', years: 20, remaining: 18 },
  { planet: 'Sun', years: 6, remaining: 0 },
  { planet: 'Moon', years: 10, remaining: 10 },
  { planet: 'Mars', years: 7, remaining: 7 },
  { planet: 'Rahu', years: 18, remaining: 18 },
  { planet: 'Jupiter', years: 16, remaining: 16 },
  { planet: 'Saturn', years: 19, remaining: 19 },
  { planet: 'Mercury', years: 17, remaining: 17 },
] as const

function getHousePosition(houseIndex: number): { x: number; y: number } {
  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 150, y: 30 }, 1: { x: 210, y: 45 }, 2: { x: 260, y: 90 },
    3: { x: 275, y: 150 }, 4: { x: 260, y: 210 }, 5: { x: 210, y: 255 },
    6: { x: 150, y: 270 }, 7: { x: 90, y: 255 }, 8: { x: 40, y: 210 },
    9: { x: 25, y: 150 }, 10: { x: 40, y: 90 }, 11: { x: 90, y: 45 },
  }
  return positions[houseIndex] ?? { x: 150, y: 150 }
}

export function KundliChart() {
  const [chartType, setChartType] = useState<'south' | 'north'>('south')
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  const selectedGraha = NAVagraha.find(g => g.name === selectedPlanet)
  const selectedHouse = selectedGraha ? HOUSES[selectedGraha.house - 1] : null
  const planetsInSelectedHouse = selectedGraha
    ? NAVagraha.filter(g => g.house === selectedGraha.house)
    : []

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Compass className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle>Vedic Birth Chart (Kundli)</CardTitle>
                <CardDescription>
                  Planetary positions and house analysis for market predictions
                </CardDescription>
              </div>
            </div>
            <Select value={chartType} onValueChange={(v) => setChartType(v as 'south' | 'north')}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="south">South Indian</SelectItem>
                <SelectItem value="north">North Indian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex justify-center">
              <svg viewBox="0 0 300 300" className="w-full max-w-[400px] h-auto" style={{ fontFamily: 'system-ui, sans-serif' }}>
                <rect width="300" height="300" rx="12" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
                <rect x="15" y="15" width="270" height="270" rx="4" fill="none" stroke="#92400E" strokeWidth="2" />

                {chartType === 'south' ? (
                  <>
                    <polygon points="150,15 285,150 150,285 15,150" fill="none" stroke="#92400E" strokeWidth="1.5" />
                    <line x1="150" y1="15" x2="285" y2="150" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    <line x1="285" y1="150" x2="150" y2="285" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    <line x1="150" y1="285" x2="15" y2="150" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    <line x1="15" y1="150" x2="150" y2="15" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    <line x1="15" y1="150" x2="285" y2="150" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    <line x1="150" y1="15" x2="150" y2="285" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />

                    {HOUSE_SYMBOLS.map((sym, i) => {
                      const pos = getHousePosition(i)
                      return (
                        <g key={i}>
                          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#92400E" fontWeight="600" opacity="0.4">{sym}</text>
                          <text x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#92400E" opacity="0.3">{HOUSE_NUMBERS[i]}</text>
                        </g>
                      )
                    })}

                    {NAVagraha.map((graha, i) => {
                      const pos = getHousePosition(graha.house - 1)
                      const offsetY = 28 + Math.floor(i / 3) * 14
                      return (
                        <g key={graha.name} onClick={() => setSelectedPlanet(selectedPlanet === graha.name ? null : graha.name)} style={{ cursor: 'pointer' }}>
                          <circle cx={pos.x} cy={pos.y + offsetY} r="11" fill={selectedPlanet === graha.name ? graha.color : '#FEF3C7'} stroke={graha.color} strokeWidth="1.5" opacity={selectedPlanet && selectedPlanet !== graha.name ? 0.5 : 1} />
                          <text x={pos.x} y={pos.y + offsetY} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={selectedPlanet === graha.name ? '#fff' : graha.color} fontWeight="700">{graha.symbol}</text>
                        </g>
                      )
                    })}
                  </>
                ) : (
                  <>
                    <rect x="75" y="75" width="150" height="150" fill="none" stroke="#92400E" strokeWidth="1.5" />
                    <polygon points="150,15 285,75 285,225 150,285" fill="none" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    <polygon points="15,75 150,15 150,285 15,225" fill="none" stroke="#D4A574" strokeWidth="0.5" opacity="0.5" />
                    {[
                      { x: 150, y: 55, s: 'Ar', n: '1' }, { x: 220, y: 95, s: 'Ta', n: '2' },
                      { x: 240, y: 150, s: 'Ge', n: '3' }, { x: 220, y: 210, s: 'Cn', n: '4' },
                      { x: 150, y: 255, s: 'Le', n: '5' }, { x: 80, y: 210, s: 'Vi', n: '6' },
                      { x: 55, y: 150, s: 'Li', n: '7' }, { x: 80, y: 95, s: 'Sc', n: '8' },
                    ].map((h, i) => (
                      <g key={i}>
                        <text x={h.x} y={h.y} textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="600" opacity="0.4">{h.s}</text>
                        <text x={h.x} y={h.y + 10} textAnchor="middle" fontSize="7" fill="#92400E" opacity="0.3">{h.n}</text>
                      </g>
                    ))}
                    {[
                      { x: 120, y: 110, s: 'Sg', n: '9' }, { x: 180, y: 110, s: 'Cp', n: '10' },
                      { x: 180, y: 195, s: 'Aq', n: '11' }, { x: 120, y: 195, s: 'Pi', n: '12' },
                    ].map((h, i) => (
                      <g key={`inner-${i}`}>
                        <text x={h.x} y={h.y} textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="600" opacity="0.4">{h.s}</text>
                        <text x={h.x} y={h.y + 10} textAnchor="middle" fontSize="7" fill="#92400E" opacity="0.3">{h.n}</text>
                      </g>
                    ))}
                    {NAVagraha.map((graha) => {
                      const northPositions: Record<string, { x: number; y: number }> = {
                        '1': { x: 150, y: 85 }, '2': { x: 220, y: 115 }, '3': { x: 245, y: 150 },
                        '4': { x: 220, y: 225 }, '5': { x: 150, y: 270 }, '6': { x: 80, y: 225 },
                        '7': { x: 50, y: 150 }, '8': { x: 80, y: 115 }, '9': { x: 120, y: 130 },
                        '10': { x: 180, y: 130 }, '11': { x: 180, y: 180 }, '12': { x: 120, y: 180 },
                      }
                      const pos = northPositions[String(graha.house)]
                      if (!pos) return null
                      return (
                        <g key={graha.name} onClick={() => setSelectedPlanet(selectedPlanet === graha.name ? null : graha.name)} style={{ cursor: 'pointer' }}>
                          <circle cx={pos.x} cy={pos.y} r="11" fill={selectedPlanet === graha.name ? graha.color : '#FEF3C7'} stroke={graha.color} strokeWidth="1.5" opacity={selectedPlanet && selectedPlanet !== graha.name ? 0.5 : 1} />
                          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={selectedPlanet === graha.name ? '#fff' : graha.color} fontWeight="700">{graha.symbol}</text>
                        </g>
                      )
                    })}
                  </>
                )}
                <text x="150" y="10" textAnchor="middle" fontSize="8" fill="#D97706" fontWeight="600">ASC</text>
              </svg>
            </div>

            <div className="lg:w-72 space-y-4">
              {selectedPlanet ? (
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-3" style={{ backgroundColor: `${selectedGraha?.color}20` }}>
                        <Star className="h-5 w-5" style={{ color: selectedGraha?.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{selectedGraha?.name}</CardTitle>
                        <CardDescription>House {selectedGraha?.house} — {selectedHouse}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Sign</span><span className="font-medium">{selectedHouse}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">House</span><span className="font-medium">{selectedGraha?.house}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Nakshatra</span><span className="font-medium">{NAKSHATRAS[(selectedGraha?.house ?? 0) % 27]}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="outline" className="text-[10px]">Active</Badge></div>
                    {planetsInSelectedHouse.length > 1 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Co-tenants:</p>
                        <div className="flex flex-wrap gap-1">
                          {planetsInSelectedHouse.map(p => (
                            <Badge key={p.name} variant="secondary" className="text-[10px]" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                              {p.symbol} {p.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Eye className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click any planet in the chart to view its details</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Navagraha (9 Planets)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {NAVagraha.map(graha => (
                    <div key={graha.name} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedPlanet(selectedPlanet === graha.name ? null : graha.name)}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: graha.color }} />
                        <span className="text-xs font-medium">{graha.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">House {graha.house}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dasha & Nakshatras */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-600" />
              Vimshottari Dasha Periods
            </CardTitle>
            <CardDescription>Current planetary periods and their durations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {DASHA_PERIODS.map((dasha, i) => {
                const isActive = dasha.remaining === dasha.years
                const progress = ((dasha.years - dasha.remaining) / dasha.years) * 100
                return (
                  <div key={dasha.planet} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="w-8 text-center">
                      <span className={`text-xs font-bold ${isActive ? 'text-amber-600' : 'text-muted-foreground'}`}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{dasha.planet}</span>
                        <span className="text-xs text-muted-foreground">{dasha.years} years</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: isActive ? '#D97706' : '#D4D4D4' }} />
                      </div>
                    </div>
                    {isActive && <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0">Active</Badge>}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-600" />
              27 Nakshatras
            </CardTitle>
            <CardDescription>Lunar mansions for precise Vedic predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-1.5 max-h-80 overflow-y-auto">
              {NAKSHATRAS.map((nak, i) => {
                const ruler = NAVagraha[i % 7]
                return (
                  <div key={nak} className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-muted/50 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ruler?.color ?? '#999' }} />
                    <span className="truncate">{nak}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useMemo } from 'react'

interface StockPrice {
  close: number
  date: string
}

interface MiniChartProps {
  prices: StockPrice[]
  width?: number
  height?: number
  positive?: boolean
}

export function MiniChart({ prices, width = 80, height = 32, positive }: MiniChartProps) {
  const points = useMemo(() => {
    if (!prices || prices.length < 2) return ''

    const sortedPrices = [...prices].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const closes = sortedPrices.map((p) => p.close)
    const min = Math.min(...closes)
    const max = Math.max(...closes)
    const range = max - min || 1

    const padding = 2
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const pts = closes.map((c, i) => {
      const x = padding + (i / (closes.length - 1)) * chartWidth
      const y = padding + chartHeight - ((c - min) / range) * chartHeight
      return `${x},${y}`
    })

    return pts.join(' ')
  }, [prices, width, height])

  const color = positive !== undefined
    ? positive ? '#16A34A' : '#DC2626'
    : prices && prices.length >= 2
      ? prices[0].close >= prices[prices.length - 1].close ? '#16A34A' : '#DC2626'
      : '#9CA3AF'

  if (!points) {
    return (
      <svg width={width} height={height} className="opacity-40">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#D4D4D4" strokeWidth="1" strokeDasharray="3,2" />
      </svg>
    )
  }

  const lastPoint = points.split(' ').pop()?.split(',')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${positive ? 'up' : 'down'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastPoint?.[0]}
        cy={lastPoint?.[1]}
        r="2"
        fill={color}
      />
    </svg>
  )
}

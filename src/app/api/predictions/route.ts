// ============================================
// NEPSE Vedic Astrology Trading Platform
// Market Predictions API - List & Create
// GET  /api/predictions  - List predictions (future by default)
// POST /api/predictions  - Create prediction (editor+ only)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { createMarketPredictionSchema } from '@/lib/validations'
import type { PredictionType } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const typeFilter = searchParams.get('type') as PredictionType | null
    const dateFilter = searchParams.get('date')
    const showAll = searchParams.get('all') === 'true'

    const where: Record<string, unknown> = {}
    if (typeFilter) where.predictionType = typeFilter
    if (dateFilter) {
      const startOfDay = new Date(dateFilter)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(dateFilter)
      endOfDay.setUTCHours(23, 59, 59, 999)
      where.targetDate = { gte: startOfDay, lte: endOfDay }
    }

    // By default, only show future predictions (targetDate >= today)
    if (!showAll && !dateFilter) {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      where.targetDate = { gte: today }
    }

    const predictions = await db.marketPrediction.findMany({
      where,
      include: {
        vedicEvent: {
          select: { id: true, name: true, eventType: true, marketImpact: true },
        },
        stock: {
          select: { id: true, symbol: true, name: true },
        },
      },
      orderBy: { targetDate: 'asc' },
    })

    return success(predictions)
  } catch (err) {
    console.error('GET /api/predictions error:', err)
    return error('Failed to fetch predictions', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireRole('EDITOR', 'ADMIN')
    if (response) return response

    const body = await request.json()
    const parsed = createMarketPredictionSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    // Validate vedic event exists
    const vedicEvent = await db.vedicEvent.findUnique({ where: { id: data.vedicEventId } })
    if (!vedicEvent) {
      return error('Vedic event not found', 400)
    }

    // Validate stock if provided
    if (data.stockId) {
      const stock = await db.stock.findUnique({ where: { id: data.stockId } })
      if (!stock) {
        return error('Stock not found', 400)
      }
    }

    const prediction = await db.marketPrediction.create({
      data: {
        vedicEventId: data.vedicEventId,
        stockId: data.stockId,
        predictionType: data.predictionType,
        prediction: data.prediction,
        confidence: data.confidence,
        reasoning: data.reasoning,
        targetDate: new Date(data.targetDate),
      },
      include: {
        vedicEvent: {
          select: { id: true, name: true, eventType: true },
        },
        stock: {
          select: { id: true, symbol: true, name: true },
        },
      },
    })

    return success(prediction, 201)
  } catch (err) {
    console.error('POST /api/predictions error:', err)
    return error('Failed to create prediction', 500)
  }
}

// ============================================
// NEPSE Vedic Astrology Trading Platform
// Shared TypeScript Types & Enums
// ============================================

// --- Enums ---

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type VedicEventType = 'ECLIPSE' | 'RETROGRADE' | 'TRANSIT' | 'CONJUNCTION'
export type MarketImpact = 'BULLISH' | 'BEARISH' | 'NEUTRAL'
export type ImpactStrength = 'LOW' | 'MEDIUM' | 'HIGH'
export type PredictionType = 'DAILY' | 'WEEKLY' | 'MONTHLY'
export type SettingType = 'STRING' | 'NUMBER' | 'JSON' | 'BOOLEAN'

// --- User & Auth ---

export interface IUser {
  id: string
  email: string
  name: string | null
  password: string | null
  role: UserRole
  avatar: string | null
  phone: string | null
  birthDate: Date | null
  birthTime: string | null
  birthPlace: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ISession {
  id: string
  sessionToken: string
  userId: string
  expires: Date
  createdAt: Date
  user?: IUser
}

// --- CMS ---

export interface IPage {
  id: string
  slug: string
  title: string
  content: string
  metaTitle: string | null
  metaDescription: string | null
  status: ContentStatus
  authorId: string
  featuredImage: string | null
  createdAt: Date
  updatedAt: Date
  author?: IUser
}

export interface IBlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  status: ContentStatus
  categoryId: string | null
  authorId: string
  featuredImage: string | null
  viewCount: number
  createdAt: Date
  updatedAt: Date
  author?: IUser
  category?: IBlogCategory
}

export interface IBlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  blogPosts?: IBlogPost[]
}

export interface IMedia {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt: string | null
  uploadedBy: string
  createdAt: Date
  uploader?: IUser
}

// --- Market Data ---

export interface IMarketIndex {
  id: string
  name: string
  value: number
  change: number
  changePercent: number
  volume: number
  date: Date
}

export interface IStock {
  id: string
  symbol: string
  name: string
  sector: string | null
  description: string | null
  isActive: boolean
  prices?: IStockPrice[]
  watchlistItems?: IWatchlistItem[]
  predictions?: IMarketPrediction[]
}

export interface IStockPrice {
  id: string
  stockId: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  date: Date
  stock?: IStock
}

export interface IWatchlist {
  id: string
  userId: string
  name: string
  createdAt: Date
  user?: IUser
  items?: IWatchlistItem[]
}

export interface IWatchlistItem {
  id: string
  watchlistId: string
  stockId: string
  watchlist?: IWatchlist
  stock?: IStock
}

// --- Vedic / Astrology ---

export interface IVedicEvent {
  id: string
  name: string
  eventType: VedicEventType
  planet: string | null
  startDate: Date
  endDate: Date | null
  description: string | null
  marketImpact: MarketImpact
  impactStrength: ImpactStrength
  createdAt: Date
  predictions?: IMarketPrediction[]
}

export interface IMarketPrediction {
  id: string
  vedicEventId: string
  stockId: string | null
  predictionType: PredictionType
  prediction: MarketImpact
  confidence: number
  reasoning: string | null
  targetDate: Date
  actualOutcome: MarketImpact | null
  createdAt: Date
  vedicEvent?: IVedicEvent
  stock?: IStock
}

// --- Admin / System ---

export interface ISiteSettings {
  id: string
  key: string
  value: string
  type: SettingType
  group: string | null
  description: string | null
  updatedAt: Date
}

export interface IActivityLog {
  id: string
  userId: string | null
  action: string
  details: string | null
  ipAddress: string | null
  createdAt: Date
  user?: IUser
}

// --- Permission Constants ---

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'manage_users',
    'manage_content',
    'manage_pages',
    'manage_blog',
    'manage_media',
    'manage_market_data',
    'manage_vedic_events',
    'manage_predictions',
    'manage_settings',
    'manage_watchlists',
    'view_analytics',
    'manage_activity_logs',
  ],
  EDITOR: [
    'manage_content',
    'manage_pages',
    'manage_blog',
    'manage_media',
    'manage_vedic_events',
    'manage_predictions',
    'view_analytics',
  ],
  VIEWER: [
    'view_content',
    'view_blog',
    'view_market_data',
    'view_vedic_events',
    'view_predictions',
    'manage_watchlists',
  ],
}

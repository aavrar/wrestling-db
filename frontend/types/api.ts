// API response and request types

import {
  WrestlerSearchResult,
  WrestlerProfile,
  FeaturedWrestler,
  Match,
  Championship,
  TimelineEvent,
  Rivalry,
  Achievement,
  MonthlyStats,
  MatchTypeStats,
  SearchFilters,
  PaginationParams
} from './wrestler'

// Base API response structure
export interface BaseApiResponse {
  success: boolean
  timestamp: string
  requestId?: string
}

export interface ApiSuccessResponse<T> extends BaseApiResponse {
  success: true
  data: T
  pagination?: PaginationInfo
  meta?: ResponseMeta
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    stack?: string
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Pagination information
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Response metadata
export interface ResponseMeta {
  cached: boolean
  cacheExpiry?: string
  processingTime?: number
  dataSource?: string
}

// Search API types
export interface SearchRequest {
  query: string
  filters?: SearchFilters
  pagination?: PaginationParams
}

export interface SearchResponse {
  results: WrestlerSearchResult[]
  suggestions?: string[]
  totalResults: number
  searchTime: number
}

// Featured wrestlers API types
export interface FeaturedWrestlersResponse {
  featured: FeaturedWrestler[]
  categories?: {
    [key: string]: FeaturedWrestler[]
  }
}

// Wrestler profile API types
export interface WrestlerProfileRequest {
  id: string
  includeMatches?: boolean
  includeChampionships?: boolean
  includeTimeline?: boolean
  includeRivalries?: boolean
  includeAchievements?: boolean
  includeRelated?: boolean
  includeStats?: boolean
}

export interface WrestlerProfileResponse {
  wrestler: WrestlerProfile
  lastUpdated: string
  dataCompleteness: number // 0-100 percentage
}

// Wrestler stats API types
export interface WrestlerStatsRequest {
  id: string
  timeframe?: 'all' | 'yearly' | 'monthly' | 'recent'
  year?: number
}

export interface WrestlerStatsResponse {
  stats: {
    overall: {
      totalMatches: number
      wins: number
      losses: number
      draws: number
      winRate: number
    }
    recent: {
      last10: { wins: number; losses: number; draws: number }
      last20: { wins: number; losses: number; draws: number }
      currentStreak: { type: 'win' | 'loss'; count: number }
    }
    breakdown: {
      byPromotion: { [promotion: string]: { wins: number; losses: number; draws: number } }
      byMatchType: { [type: string]: { wins: number; losses: number; draws: number } }
      byYear: { [year: string]: { wins: number; losses: number; draws: number } }
    }
  }
}

// Matches API types
export interface MatchesRequest {
  wrestlerId: string
  pagination?: PaginationParams
  filters?: {
    promotion?: string
    matchType?: string
    opponent?: string
    dateFrom?: string
    dateTo?: string
    result?: 'win' | 'loss' | 'draw'
  }
}

export interface MatchesResponse {
  matches: Match[]
  summary: {
    totalMatches: number
    wins: number
    losses: number
    draws: number
    promotions: string[]
    matchTypes: string[]
  }
}

// Championships API types
export interface ChampionshipsRequest {
  wrestlerId: string
  includeCurrent?: boolean
  includeHistory?: boolean
}

export interface ChampionshipsResponse {
  current: Championship[]
  history: Championship[]
  summary: {
    totalTitles: number
    totalReigns: number
    totalDaysAsChampion: number
    promotions: string[]
  }
}

// Timeline API types
export interface TimelineRequest {
  wrestlerId: string
  eventTypes?: string[]
  dateFrom?: string
  dateTo?: string
  significance?: 'low' | 'medium' | 'high'
}

export interface TimelineResponse {
  events: TimelineEvent[]
  milestones: {
    debut?: TimelineEvent
    firstChampionship?: TimelineEvent
    retirementDate?: TimelineEvent
    majorInjuries: TimelineEvent[]
  }
}

// Rivalries API types
export interface RivalriesRequest {
  wrestlerId: string
  minMatches?: number
  includeInactive?: boolean
}

export interface RivalriesResponse {
  rivalries: Rivalry[]
  summary: {
    totalRivals: number
    totalRivalryMatches: number
    dominantRival?: {
      opponentId: string
      name: string
      record: string
    }
  }
}

// Achievements API types
export interface AchievementsRequest {
  wrestlerId: string
  categories?: string[]
  significance?: 'low' | 'medium' | 'high'
}

export interface AchievementsResponse {
  achievements: Achievement[]
  summary: {
    totalAchievements: number
    byCategory: { [category: string]: number }
    bySignificance: { [significance: string]: number }
  }
}

// Related wrestlers API types
export interface RelatedWrestlersRequest {
  wrestlerId: string
  limit?: number
  criteria?: 'similar_style' | 'same_promotion' | 'common_opponents' | 'era'
}

export interface RelatedWrestlersResponse {
  related: WrestlerSearchResult[]
  criteria: string
  similarity: {
    [wrestlerId: string]: number // 0-1 similarity score
  }
}

// Monthly stats API types
export interface MonthlyStatsRequest {
  wrestlerId: string
  year?: number
  months?: number[] // 1-12
}

export interface MonthlyStatsResponse {
  stats: MonthlyStats[]
  yearly: {
    [year: number]: {
      totalMatches: number
      wins: number
      losses: number
      draws: number
      winRate: number
    }
  }
}

// Match type stats API types
export interface MatchTypeStatsRequest {
  wrestlerId: string
  includeRare?: boolean // Include match types with < 5 matches
}

export interface MatchTypeStatsResponse {
  stats: MatchTypeStats[]
  summary: {
    mostSuccessfulType: string
    leastSuccessfulType: string
    favoriteType: string // most frequent
  }
}

// Batch request types
export interface BatchRequest {
  requests: {
    id: string
    endpoint: string
    params: any
  }[]
}

export interface BatchResponse {
  responses: {
    id: string
    success: boolean
    data?: any
    error?: any
  }[]
}

// Cache control types
export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
  force?: boolean // Force refresh
}

// Rate limiting types
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number // Unix timestamp
  retryAfter?: number // Seconds to wait before retry
}

// API client configuration
export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
  auth?: {
    type: 'bearer' | 'api_key' | 'basic'
    token?: string
    apiKey?: string
    username?: string
    password?: string
  }
  cache?: {
    enabled: boolean
    ttl: number
    storage: 'memory' | 'localStorage' | 'sessionStorage'
  }
}

// Request interceptor types
export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onError?: (error: any) => any
}

export interface ResponseInterceptor {
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>
  onError?: (error: any) => any
}

// Request configuration
export interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
  timeout?: number
  cache?: CacheOptions
  retries?: number
  retryDelay?: number
}

// Webhook types (if implementing real-time updates)
export interface WebhookEvent {
  type: 'wrestler_updated' | 'new_match' | 'championship_change' | 'retirement'
  data: any
  timestamp: string
  source: string
}

// Analytics and metrics types
export interface ApiMetrics {
  requestCount: number
  errorCount: number
  averageResponseTime: number
  cacheHitRate: number
  popularEndpoints: { [endpoint: string]: number }
}
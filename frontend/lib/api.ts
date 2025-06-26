import { z } from 'zod'
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
} from '../types/wrestler'
import {
  ApiResponse,
  ApiClientConfig,
  RequestConfig,
  CacheOptions,
  RateLimitInfo
} from '../types/api'

// Enhanced API client configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 20000,
  retries: 3,
  retryDelay: 1000,
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    storage: 'memory'
  }
}

// Enhanced cache implementation
class ApiCache {
  private cache = new Map<string, { data: any; expiry: number }>()

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry || Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000
    })
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

// Global cache instance
const apiCache = new ApiCache()

// Custom error classes
export class ApiError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', 0, details)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

// Zod schemas for API validation
export const WrestlerSearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthplace: z.string().optional().default(""),
  rating: z.string().optional().default("0"),
  votes: z.number().default(0)
})

export const MatchSchema = z.object({
  date: z.string(),
  promotion: z.string(),
  match: z.string(),
  result: z.enum(['win', 'loss', 'draw']).optional(),
  matchType: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional()
}).passthrough()

export const WrestlerProfileSchema = z.object({
  name: z.string().default("Unknown Wrestler"),
  bio: z.string().default(""),
  height: z.string().default(""),
  weight: z.string().default(""),
  hometown: z.string().default(""),
  matches: z.array(MatchSchema).default([]),
  win: z.number().default(0),
  loss: z.number().default(0),
  draw: z.number().default(0),
  timeline: z.array(z.any()).default([])
})

// Type for the actual API response
export type ApiWrestlerProfile = z.infer<typeof WrestlerProfileSchema>

export const FeaturedWrestlerSchema = z.object({
  id: z.string(),
  name: z.string(),
  promotion: z.string(),
  image: z.string().optional(),
  rating: z.number(),
  totalMatches: z.number(),
  winRate: z.number(),
  currentTitles: z.array(z.string()),
  isActive: z.boolean()
})

// Enhanced API client class
export class ApiClient {
  private config: ApiClientConfig
  private rateLimitInfo: RateLimitInfo | null = null

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getCacheKey(url: string, options?: RequestConfig): string {
    return `${url}:${JSON.stringify(options?.params || {})}`
  }

  private async makeRequest<T>(
    url: string,
    options: RequestConfig = { url, method: 'GET' }
  ): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`
    const cacheKey = this.getCacheKey(fullUrl, options)

    // Check cache first
    if (options.method === 'GET' && this.config.cache?.enabled) {
      const cached = apiCache.get<T>(cacheKey)
      if (cached) {
        return cached
      }
    }

    let lastError: Error | null = null
    const maxRetries = options.retries ?? this.config.retries ?? 3

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeout = options.timeout ?? this.config.timeout ?? 10000

        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const fetchOptions: RequestInit = {
          method: options.method,
          headers: {
            'Content-Type': 'application/json',
            ...this.config.headers,
            ...options.headers
          },
          signal: controller.signal
        }

        if (options.data) {
          fetchOptions.body = JSON.stringify(options.data)
        }

        const response = await fetch(fullUrl, fetchOptions)
        clearTimeout(timeoutId)

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60')
          if (attempt < maxRetries) {
            await this.delay(retryAfter * 1000)
            continue
          }
        }

        // Update rate limit info
        this.updateRateLimitInfo(response)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            errorData.code || 'HTTP_ERROR',
            response.status,
            errorData
          )
        }

        const data = await response.json()

        // Cache successful GET requests
        if (options.method === 'GET' && this.config.cache?.enabled) {
          apiCache.set(cacheKey, data, this.config.cache.ttl)
        }

        return data
      } catch (error) {
        lastError = error as Error

        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new NetworkError('Request timeout', { attempt, maxRetries })
        }

        if (attempt < maxRetries) {
          const delay = (options.retryDelay ?? this.config.retryDelay ?? 1000) * Math.pow(2, attempt)
          await this.delay(delay)
          continue
        }
      }
    }

    if (lastError) {
      if (lastError instanceof TypeError) {
        throw new NetworkError('Network error: Unable to connect to server', lastError)
      }
      throw lastError
    }

    throw new ApiError('Unknown error occurred')
  }

  private updateRateLimitInfo(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit')
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const reset = response.headers.get('X-RateLimit-Reset')

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset)
      }
    }
  }

  async get<T>(url: string, params?: Record<string, any>, options?: Partial<RequestConfig>): Promise<T> {
    const urlWithParams = params ? `${url}?${new URLSearchParams(params).toString()}` : url
    return this.makeRequest<T>(urlWithParams, { url: urlWithParams, method: 'GET', ...options })
  }

  async post<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<T> {
    return this.makeRequest<T>(url, { url, method: 'POST', data, ...options })
  }

  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo
  }

  clearCache(): void {
    apiCache.clear()
  }
}

// Global API client instance
const apiClient = new ApiClient()

// Enhanced search function with validation and error handling
export async function searchWrestlers(
  query: string, 
  filters?: SearchFilters
): Promise<WrestlerSearchResult[]> {
  try {
    if (!query.trim()) {
      throw new ValidationError('Search query cannot be empty')
    }

    const params: Record<string, string> = {}
    if (filters?.minVotes) params.minVotes = filters.minVotes.toString()
    if (filters?.minRating) params.minRating = filters.minRating.toString()
    if (filters?.birthplace) params.birthplace = filters.birthplace

    const url = `/api/search/${encodeURIComponent(query.trim())}`
    const data = await apiClient.get<WrestlerSearchResult[]>(url, params)
    
    // Validate response data with Zod
    const validatedData = z.array(WrestlerSearchResultSchema).parse(data)
    return validatedData
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid response format from server', error.errors)
    }
    throw error
  }
}

// Enhanced wrestler profile function
export async function getWrestlerProfile(id: string): Promise<ApiWrestlerProfile> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<ApiWrestlerProfile>(`/api/wrestler/${encodeURIComponent(id)}`)
    
    // Validate response data with Zod
    try {
      const validatedData = WrestlerProfileSchema.parse(data)
      return validatedData
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        console.error('Zod validation error for wrestler profile:', {
          wrestlerId: id,
          errors: zodError.errors,
          receivedData: data
        })
        throw new ValidationError('Invalid wrestler profile format from server', zodError.errors)
      }
      throw zodError
    }
  } catch (error) {
    throw error
  }
}

// New enhanced API functions
export async function getFeaturedWrestlers(): Promise<FeaturedWrestler[]> {
  try {
    // Get featured wrestlers from CageMatch
    const data = await apiClient.get<any[]>('/api/featured-wrestlers')
    
    // Transform to featured wrestler format with mock data for missing fields
    const featured: FeaturedWrestler[] = data.map(wrestler => ({
      id: wrestler.id,
      name: wrestler.name,
      promotion: wrestler.promotion || 'WWE', // Default to WWE if unknown
      rating: Math.random() * 2 + 3, // Random rating between 3.0-5.0
      totalMatches: Math.floor(Math.random() * 1000) + 100, // Mock data
      winRate: Math.random() * 30 + 70, // Mock 70-100% win rate
      currentTitles: [],
      isActive: wrestler.isActive || true
    }))

    return z.array(FeaturedWrestlerSchema).parse(featured)
  } catch (error) {
    console.error('Failed to fetch featured wrestlers:', error)
    
    // Fallback to popular search if featured wrestlers endpoint fails
    try {
      const fallbackData = await apiClient.get<WrestlerSearchResult[]>('/api/search/popular', { limit: '5' })
      
      const fallbackFeatured: FeaturedWrestler[] = fallbackData.map(wrestler => ({
        id: wrestler.id,
        name: wrestler.name,
        promotion: 'WWE', // Default since API doesn't provide this
        rating: parseFloat(wrestler.rating || '0') || Math.random() * 2 + 3,
        totalMatches: Math.floor(Math.random() * 1000) + 100, // Mock data
        winRate: Math.random() * 30 + 70, // Mock 70-100% win rate
        currentTitles: [],
        isActive: true
      }))

      return z.array(FeaturedWrestlerSchema).parse(fallbackFeatured)
    } catch (fallbackError) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid featured wrestlers format', error.errors)
      }
      throw error
    }
  }
}


export async function getWrestlerStats(id: string): Promise<{
  totalMatches: number
  wins: number
  losses: number
  draws: number
  winRate: number
  currentStreak: { type: 'win' | 'loss'; count: number }
  recentForm: { wins: number; losses: number; draws: number; period: string }
}> {
  try {
    const data = await apiClient.get<{
      name: string
      totalMatches: number
      wins: number
      losses: number
      draws: number
      winRate: number
      currentStreak: { type: 'win' | 'loss'; count: number }
      recentForm: { wins: number; losses: number; draws: number; period: string }
    }>(`/api/wrestler/${encodeURIComponent(id)}/stats`)
    
    return {
      totalMatches: data.totalMatches,
      wins: data.wins,
      losses: data.losses,
      draws: data.draws,
      winRate: data.winRate,
      currentStreak: data.currentStreak,
      recentForm: data.recentForm
    }
  } catch (error) {
    console.error('Error fetching wrestler stats:', error)
    throw error
  }
}

export async function searchWrestlersWithDebounce(
  query: string,
  filters?: SearchFilters,
  delay: number = 300
): Promise<WrestlerSearchResult[]> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchWrestlers(query, filters)
        resolve(results)
      } catch (error) {
        reject(error)
      }
    }, delay)

    // Store timeout ID for potential cancellation
    ;(searchWrestlersWithDebounce as any).timeoutId = timeoutId
  })
}

// Cancel previous debounced search
export function cancelDebouncedSearch(): void {
  const timeoutId = (searchWrestlersWithDebounce as any).timeoutId
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

// Helper function to transform API wrestler to Next.js wrestler format
export function transformWrestlerData(profile: ApiWrestlerProfile, id: string) {
  const totalMatches = profile.win + profile.loss + profile.draw
  const winRate = totalMatches > 0 ? ((profile.win / totalMatches) * 100) : 0
  
  return {
    id,
    name: profile.name,
    realName: profile.name, // API doesn't provide real name separately
    nickname: '', // API doesn't provide nickname
    promotion: 'WWE', // Default, could be extracted from matches
    height: profile.height || '',
    weight: profile.weight || '',
    hometown: profile.hometown || '',
    debut: '', // API doesn't provide debut date
    image: '/placeholder.svg?height=400&width=300',
    rating: 4.5, // Default rating
    totalMatches,
    wins: profile.win,
    losses: profile.loss,
    draws: profile.draw,
    winRate: Number(winRate.toFixed(1)),
    currentTitles: [], // API doesn't provide current titles
    bio: profile.bio || '',
    finishers: [], // API doesn't provide finishers
    themes: [], // API doesn't provide themes
    social: {
      twitter: '',
      instagram: '',
    },
    matches: profile.matches || []
  }
}

// Helper function to create slug from wrestler name
export function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
}

// Helper function to extract promotion from matches
export function getMainPromotion(matches: Match[]): string {
  if (!matches.length) return 'WWE'
  
  const promotionCount: Record<string, number> = {}
  matches.forEach(match => {
    const promotion = match.promotion || 'Unknown'
    promotionCount[promotion] = (promotionCount[promotion] || 0) + 1
  })
  
  const sortedPromotions = Object.entries(promotionCount)
    .sort(([,a], [,b]) => b - a)
  
  return sortedPromotions[0]?.[0] || 'WWE'
}

// Get wrestler recent matches (fast, limited results)
export async function getWrestlerRecentMatches(id: string, limit: number = 5): Promise<Match[]> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{name: string, matches: Match[]}>(`/api/wrestler/${encodeURIComponent(id)}/recent-matches`, { limit: limit.toString() })
    
    // Validate response data with Zod
    try {
      const validatedData = z.object({
        name: z.string(),
        matches: z.array(MatchSchema)
      }).parse(data)
      
      return validatedData.matches
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        console.error('Zod validation error for recent matches:', {
          wrestlerId: id,
          errors: zodError.errors,
          receivedData: data
        })
        throw new ValidationError('Invalid recent matches format from server', zodError.errors)
      }
      throw zodError
    }
  } catch (error) {
    throw error
  }
}

// Get wrestler matches with pagination
export async function getWrestlerMatchesPaginated(
  id: string, 
  page: number = 1, 
  limit: number = 100
): Promise<{
  matches: Match[]
  pagination: {
    page: number
    limit: number
    totalOnPage: number
    hasMore: boolean
  }
  name: string
}> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{
      name: string
      matches: Match[]
      pagination: {
        page: number
        limit: number
        totalOnPage: number
        hasMore: boolean
      }
    }>(`/api/wrestler/${encodeURIComponent(id)}/matches`, { 
      page: page.toString(), 
      limit: limit.toString() 
    })
    
    // Validate response data with Zod
    try {
      const validatedData = z.object({
        name: z.string(),
        matches: z.array(MatchSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          totalOnPage: z.number(),
          hasMore: z.boolean()
        })
      }).parse(data)
      
      return validatedData
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        console.error('Zod validation error for paginated matches:', {
          wrestlerId: id,
          errors: zodError.errors,
          receivedData: data
        })
        throw new ValidationError('Invalid paginated matches format from server', zodError.errors)
      }
      throw zodError
    }
  } catch (error) {
    throw error
  }
}

// Get wrestler matches with enhanced data (legacy function for compatibility)
export async function getWrestlerMatches(id: string): Promise<Match[]> {
  try {
    // Use the new recent matches endpoint for better performance
    return await getWrestlerRecentMatches(id, 10)
  } catch (error) {
    console.error('Failed to fetch wrestler matches:', error)
    return []
  }
}

// Get wrestler championships
export async function getWrestlerChampionships(id: string): Promise<Championship[]> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{name: string, championships: any[]}>(`/api/wrestler/${encodeURIComponent(id)}/championships`)
    
    // Transform API response to Championship format
    const championships: Championship[] = data.championships.map((champ: any, index: number) => ({
      id: index.toString(),
      title: champ.title || 'Unknown Championship',
      promotion: champ.promotion || 'Unknown',
      wonDate: champ.wonDate || champ.dateInfo || new Date().toISOString().split('T')[0],
      current: champ.current === true || champ.current === 'Current',
      lostDate: champ.current === true ? undefined : (champ.lostDate || champ.dateInfo),
      daysHeld: champ.daysHeld || 0,
      defenses: champ.defenses || 0
    }))
    
    return championships
  } catch (error) {
    throw error
  }
}

// Get wrestler timeline
export async function getWrestlerTimeline(id: string): Promise<TimelineEvent[]> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{name: string, careerStats: any, timelineEvents: any[]}>(`/api/wrestler/${encodeURIComponent(id)}/timeline`)
    
    // Transform API response to TimelineEvent format
    // Since the API currently returns empty timelineEvents, we'll create a basic timeline from championships
    const timelineEvents: TimelineEvent[] = data.timelineEvents.map((event: any, index: number) => ({
      id: index.toString(),
      date: event.date || new Date().toISOString().split('T')[0],
      title: event.title || 'Career Event',
      description: event.description || 'Career milestone',
      type: event.type || 'other',
      promotion: event.promotion,
      significance: event.significance || 'medium'
    }))
    
    return timelineEvents
  } catch (error) {
    throw error
  }
}

// Get wrestler basic profile (fast, header data only)
export async function getWrestlerBasicProfile(id: string): Promise<{
  name: string;
  bio: string;
  height: string;
  weight: string;
  hometown: string;
}> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{
      name: string;
      bio: string;
      height: string;
      weight: string;
      hometown: string;
    }>(`/api/wrestler/${encodeURIComponent(id)}/basic`)
    
    return data
  } catch (error) {
    throw error
  }
}

// Get wrestler achievements
export async function getWrestlerAchievements(id: string): Promise<Achievement[]> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{name: string, achievements: any[]}>(`/api/wrestler/${encodeURIComponent(id)}/achievements`)
    
    // Transform API response to Achievement format
    const achievements: Achievement[] = data.achievements.map((achievement: any, index: number) => ({
      id: index.toString(),
      title: achievement.title || 'Achievement',
      description: achievement.description || '',
      date: achievement.year ? `${achievement.year}` : new Date().getFullYear().toString(),
      type: achievement.type || 'other',
      significance: 'medium' as const
    }))
    
    return achievements
  } catch (error) {
    throw error
  }
}

// Get wrestler rivalries
export async function getWrestlerRivalries(id: string): Promise<Rivalry[]> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{name: string, rivalries: any[]}>(`/api/wrestler/${encodeURIComponent(id)}/rivalries`)
    
    // Transform API response to Rivalry format
    const rivalries: Rivalry[] = data.rivalries.map((rivalry: any, index: number) => ({
      id: index.toString(),
      opponent: rivalry.opponent || 'Unknown',
      matches: rivalry.matches || 0,
      wins: rivalry.wins || 0,
      losses: rivalry.losses || 0,
      winRate: rivalry.winRate || 0,
      lastMatch: rivalry.lastMatch || 'Unknown',
      rivalry: rivalry.rivalry || 'Head-to-head',
      notable: rivalry.notable || 'Notable opponent'
    }))
    
    return rivalries
  } catch (error) {
    throw error
  }
}

// Get wrestler performance data
export async function getWrestlerPerformanceData(id: string): Promise<{
  monthlyData: MonthlyStats[]
  matchTypeStats: MatchTypeStats[]
}> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{
      name: string
      monthlyData: any[]
      matchTypeStats: any[]
    }>(`/api/wrestler/${encodeURIComponent(id)}/performance`)
    
    // Transform API response to performance format
    const monthlyData: MonthlyStats[] = data.monthlyData.map((month: any) => ({
      month: month.period || 'Unknown',
      wins: month.wins || 0,
      losses: month.losses || 0,
      winRate: month.winRate || 0,
      matches: month.matches || 0
    }))
    
    const matchTypeStats: MatchTypeStats[] = data.matchTypeStats.map((stat: any) => ({
      type: stat.type || 'Unknown',
      matches: stat.matches || 0,
      wins: stat.wins || 0,
      percentage: stat.percentage || 0
    }))
    
    return { monthlyData, matchTypeStats }
  } catch (error) {
    throw error
  }
}

// Get related wrestlers (hybrid approach)
export async function getRelatedWrestlers(id: string): Promise<any[]> {
  try {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Wrestler ID is required and must be a string')
    }

    const data = await apiClient.get<{name: string, relatedWrestlers: any[]}>(`/api/wrestler/${encodeURIComponent(id)}/related`)
    
    // Transform API response to related wrestlers format
    const relatedWrestlers = data.relatedWrestlers.map((wrestler: any) => ({
      id: wrestler.id || 'unknown',
      name: wrestler.name || 'Unknown',
      nickname: wrestler.nickname || '',
      promotion: wrestler.promotion || 'WWE',
      rating: wrestler.rating || 4.0,
      relationship: wrestler.relationship || 'Related',
      winRate: wrestler.winRate || 75,
      matches: wrestler.matches || 100
    }))
    
    return relatedWrestlers
  } catch (error) {
    throw error
  }
}

// Export the API client for direct use in components
export { apiClient }
// Comprehensive TypeScript types for wrestler data

export interface WrestlerSearchResult {
  id: string
  name: string
  birthplace?: string
  rating?: string
  votes: number
}

export interface Match {
  date: string
  promotion: string
  match: string
  result?: 'win' | 'loss' | 'draw'
  matchType?: string
  location?: string
  duration?: string
}

export interface Championship {
  id: string
  title: string
  promotion: string
  wonDate: string
  lostDate?: string
  daysHeld?: number
  defenses?: number
  current: boolean
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'debut' | 'championship' | 'injury' | 'retirement' | 'return' | 'major_match' | 'other'
  promotion?: string
  significance: 'low' | 'medium' | 'high'
}

export interface Rivalry {
  id: string
  opponent: {
    id: string
    name: string
    image?: string
  }
  totalMatches: number
  wins: number
  losses: number
  draws: number
  firstMeet: string
  lastMeet: string
  majorMatches: Match[]
  storylineDescription?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  dateAchieved: string
  category: 'championship' | 'record' | 'milestone' | 'award' | 'other'
  significance: 'low' | 'medium' | 'high'
  icon?: string
}

export interface WrestlerStats {
  totalMatches: number
  wins: number
  losses: number
  draws: number
  winRate: number
  currentStreak: {
    type: 'win' | 'loss'
    count: number
  }
  recentForm: {
    wins: number
    losses: number
    draws: number
    period: string // e.g., "last 10 matches"
  }
}

export interface MonthlyStats {
  month: string
  year: number
  matches: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface MatchTypeStats {
  matchType: string
  matches: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface WrestlerProfile {
  id: string
  name: string
  realName?: string
  nickname?: string
  bio: string
  height: string
  weight: string
  hometown: string
  birthdate?: string
  debut?: string
  promotion: string
  image?: string
  rating: number
  stats: WrestlerStats
  currentTitles: Championship[]
  finishers?: string[]
  themes?: {
    name: string
    artist?: string
    url?: string
  }[]
  social?: {
    twitter?: string
    instagram?: string
    youtube?: string
  }
  matches: Match[]
  championships: Championship[]
  timeline: TimelineEvent[]
  rivalries: Rivalry[]
  achievements: Achievement[]
  relatedWrestlers: WrestlerSearchResult[]
  monthlyStats: MonthlyStats[]
  matchTypeStats: MatchTypeStats[]
}

export interface FeaturedWrestler {
  id: string
  name: string
  promotion: string
  image?: string
  rating: number
  totalMatches: number
  winRate: number
  currentTitles: string[]
  isActive: boolean
}

// Search and filter types
export interface SearchFilters {
  minVotes?: number
  minRating?: number
  birthplace?: string
  promotion?: string
  isActive?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Component prop types
export interface WrestlerCardProps {
  wrestler: WrestlerSearchResult | FeaturedWrestler
  variant?: 'search' | 'featured' | 'related'
  showStats?: boolean
}

export interface MatchCardProps {
  match: Match
  wrestlerName: string
  showResult?: boolean
  variant?: 'recent' | 'timeline' | 'rivalry'
}

export interface ChampionshipCardProps {
  championship: Championship
  variant?: 'current' | 'history'
  showDuration?: boolean
}

// Error and loading states
export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface LoadingState {
  isLoading: boolean
  error: ApiError | null
  data: any | null
}

// Utility types
export type WrestlerSlug = string
export type WrestlerId = string
export type PromotionName = string

// Form and input types
export interface SearchFormData {
  query: string
  filters: SearchFilters
}

export interface ContactForm {
  wrestlerIds: string[]
  matchTypes: string[]
  promotions: string[]
}

// API response wrapper types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    details?: any
  }
}

// Chart and visualization data types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface PerformanceChartData {
  monthlyStats: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
  matchTypeStats: ChartDataPoint[]
  winLossDistribution: ChartDataPoint[]
}

// Hook return types
export interface UseWrestlerReturn {
  wrestler: WrestlerProfile | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export interface UseSearchReturn {
  results: WrestlerSearchResult[]
  isLoading: boolean
  error: ApiError | null
  search: (query: string, filters?: SearchFilters) => Promise<void>
  clearResults: () => void
}

export interface UseFeaturedWrestlersReturn {
  wrestlers: FeaturedWrestler[]
  isLoading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}
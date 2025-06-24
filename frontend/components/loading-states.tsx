'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Wrestling-themed loading spinner
export function WrestlingLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-gradient-to-r border-t-cyan-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// Skeleton for wrestler search results
export function WrestlerSearchSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="bg-white/60 backdrop-blur-xl border-slate-200/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-[80px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton for wrestler profile header
export function WrestlerHeaderSkeleton() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3 gap-0">
          {/* Image skeleton */}
          <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-cyan-100 to-purple-100">
            <Skeleton className="absolute inset-4 rounded-2xl" />
          </div>
          
          {/* Info skeleton */}
          <div className="md:col-span-2 p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for stats overview cards
export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="bg-white/60 backdrop-blur-xl border-slate-200/50">
          <CardContent className="p-6 text-center">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton for recent matches
export function RecentMatchesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardHeader>
        <Skeleton className="h-6 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-[80px] ml-auto" />
                <Skeleton className="h-3 w-[60px] ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for championship history
export function ChampionshipHistorySkeleton() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardHeader>
        <Skeleton className="h-6 w-[180px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-3 w-[120px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-6 w-[80px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for career timeline
export function CareerTimelineSkeleton() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardHeader>
        <Skeleton className="h-6 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <Skeleton className="h-4 w-4 rounded-full" />
                {index < 3 && <div className="w-0.5 h-12 bg-slate-200 mt-2" />}
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-3 w-[200px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for performance charts
export function PerformanceChartsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
        <CardHeader>
          <Skeleton className="h-6 w-[140px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
        <CardHeader>
          <Skeleton className="h-6 w-[160px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

// Skeleton for rivalries section
export function RivalriesSkeleton() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardHeader>
        <Skeleton className="h-6 w-[120px]" />
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center space-x-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for achievements
export function AchievementsSkeleton() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardHeader>
        <Skeleton className="h-6 w-[130px]" />
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 text-center">
              <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
              <Skeleton className="h-4 w-[120px] mx-auto mb-1" />
              <Skeleton className="h-3 w-[80px] mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for related wrestlers
export function RelatedWrestlersSkeleton() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardHeader>
        <Skeleton className="h-6 w-[160px]" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center space-y-3">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[100px] mx-auto" />
                <Skeleton className="h-3 w-[80px] mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for featured wrestlers carousel
export function FeaturedWrestlersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-[300px] mx-auto" />
        <Skeleton className="h-4 w-[400px] mx-auto" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-xl border-slate-200/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <Skeleton className="h-64 md:h-80" />
                <div className="p-6 md:p-8 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[140px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-[120px]" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-[80px]" />
                      <Skeleton className="h-6 w-[90px]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Generic page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-[300px]" />
          <Skeleton className="h-6 w-[500px]" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Error state component
export function ErrorState({ 
  title = "Something went wrong",
  message = "We're having trouble loading this content. Please try again.",
  onRetry
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-slate-600">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-md hover:from-cyan-700 hover:to-purple-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty state component
export function EmptyState({
  title = "No data available",
  message = "There's nothing to show here yet.",
  icon
}: {
  title?: string
  message?: string
  icon?: React.ReactNode
}) {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
            {icon || (
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8h.01M6 6h.01" />
              </svg>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-slate-600">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
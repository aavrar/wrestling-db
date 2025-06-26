"use client"

import { notFound } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { WrestlerHeader } from "@/components/wrestler-profile/wrestler-header"
import { StatsOverview } from "@/components/wrestler-profile/stats-overview"
import { RecentMatches } from "@/components/wrestler-profile/recent-matches"
import { ChampionshipHistory } from "@/components/wrestler-profile/championship-history"
import { CareerTimeline } from "@/components/wrestler-profile/career-timeline"
import { PerformanceCharts } from "@/components/wrestler-profile/performance-charts"
import { Rivalries } from "@/components/wrestler-profile/rivalries"
import { Achievements } from "@/components/wrestler-profile/achievements"
import { RelatedWrestlers } from "@/components/wrestler-profile/related-wrestlers"
import { getWrestlerBasicProfile } from "@/lib/api"

interface WrestlerProfilePageProps {
  params: {
    slug: string
  }
  searchParams: {
    id?: string
  }
}

export default function WrestlerProfilePage({ params, searchParams }: WrestlerProfilePageProps) {
  const [wrestler, setWrestler] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const wrestlerId = searchParams.id
  
  useEffect(() => {
    async function fetchWrestlerData() {
      if (!wrestlerId) {
        setError('No wrestler ID provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        // Only fetch basic profile data for the header - individual components will fetch their own data
        // This reduces the load on the main endpoint and prevents timeout cascades
        const basicProfile = await getWrestlerBasicProfile(wrestlerId)
        
        // Transform basic profile to wrestler header format
        const wrestlerData = {
          id: wrestlerId,
          name: basicProfile.name,
          realName: basicProfile.name,
          nickname: '',
          promotion: 'WWE', // Default
          height: basicProfile.height || '',
          weight: basicProfile.weight || '',
          hometown: basicProfile.hometown || '',
          debut: '',
          image: '', // Will use initials-based avatar in header
          rating: 4.5,
          currentTitles: [],
          bio: basicProfile.bio || '',
          social: {
            twitter: '',
            instagram: '',
          }
        }
        
        setWrestler(wrestlerData)
      } catch (error) {
        console.error('Failed to fetch wrestler data:', error)
        // Check if it's a timeout error specifically
        if (error?.message?.includes('timeout') || error?.code === 'NETWORK_ERROR') {
          setError('Request timed out. The wrestler has a lot of match data. Please try again.')
        } else {
          setError('Failed to load wrestler data')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchWrestlerData()
  }, [wrestlerId])

  if (!wrestlerId) {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>
        <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading wrestler profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>
        <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Wrestler</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!wrestler) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>

      <WrestlerHeader wrestler={wrestler} />
      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <StatsOverview wrestlerId={wrestler.id} />
        <div className="grid lg:grid-cols-2 gap-8">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <RecentMatches wrestlerId={wrestler.id} />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <ChampionshipHistory wrestlerId={wrestler.id} />
          </Suspense>
        </div>
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>}>
          <CareerTimeline wrestlerId={wrestler.id} />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
          <PerformanceCharts wrestlerId={wrestler.id} />
        </Suspense>
        <div className="grid lg:grid-cols-2 gap-8">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <Rivalries wrestlerId={wrestler.id} />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <Achievements wrestlerId={wrestler.id} />
          </Suspense>
        </div>
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
          <RelatedWrestlers currentWrestler={wrestler} />
        </Suspense>
      </div>
    </div>
  )
}


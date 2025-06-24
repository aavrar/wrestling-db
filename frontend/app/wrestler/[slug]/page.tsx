import { notFound } from "next/navigation"
import { Suspense } from "react"
import { WrestlerHeader } from "@/components/wrestler-profile/wrestler-header"
import { StatsOverview } from "@/components/wrestler-profile/stats-overview"
import { RecentMatches } from "@/components/wrestler-profile/recent-matches"
import { ChampionshipHistory } from "@/components/wrestler-profile/championship-history"
import { CareerTimeline } from "@/components/wrestler-profile/career-timeline"
import { PerformanceCharts } from "@/components/wrestler-profile/performance-charts"
import { Rivalries } from "@/components/wrestler-profile/rivalries"
import { Achievements } from "@/components/wrestler-profile/achievements"
import { RelatedWrestlers } from "@/components/wrestler-profile/related-wrestlers"
import { getWrestlerProfile, transformWrestlerData } from "@/lib/api"

async function getWrestlerData(id: string, slug: string) {
  try {
    const profile = await getWrestlerProfile(id)
    return transformWrestlerData(profile, slug)
  } catch (error) {
    console.error('Failed to fetch wrestler data:', error)
    return null
  }
}

interface WrestlerProfilePageProps {
  params: {
    slug: string
  }
  searchParams: {
    id?: string
  }
}

export default async function WrestlerProfilePage({ params, searchParams }: WrestlerProfilePageProps) {
  const wrestlerId = searchParams.id
  
  if (!wrestlerId) {
    notFound()
  }

  const wrestler = await getWrestlerData(wrestlerId, params.slug)

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
        <StatsOverview wrestler={wrestler} />
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

export function generateStaticParams() {
  // Return empty array since we'll generate pages dynamically
  return []
}

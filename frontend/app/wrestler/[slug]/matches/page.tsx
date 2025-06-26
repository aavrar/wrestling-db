"use client"

import { notFound } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { ArrowLeft, Calendar, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getWrestlerMatchesPaginated, getWrestlerBasicProfile } from "@/lib/api"

interface MatchesPageProps {
  params: {
    slug: string
  }
  searchParams: {
    id?: string
    page?: string
  }
}

interface Match {
  date: string
  promotion: string
  match: string
  location?: string
  duration?: string
}

export default function MatchesPage({ params, searchParams }: MatchesPageProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [wrestler, setWrestler] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const wrestlerId = searchParams.id
  const pageParam = searchParams.page ? parseInt(searchParams.page) : 1

  useEffect(() => {
    if (pageParam !== currentPage) {
      setCurrentPage(pageParam)
    }
  }, [pageParam])

  useEffect(() => {
    async function fetchData() {
      if (!wrestlerId) {
        setError('No wrestler ID provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch wrestler basic info and matches in parallel
        const [basicProfile, matchesData] = await Promise.all([
          getWrestlerBasicProfile(wrestlerId),
          getWrestlerMatchesPaginated(wrestlerId, currentPage, 50)
        ])
        
        setWrestler({ name: basicProfile.name, id: wrestlerId })
        setMatches(matchesData.matches)
        setHasMore(matchesData.pagination.hasMore)
      } catch (error) {
        console.error('Failed to fetch matches data:', error)
        setError('Failed to load match history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [wrestlerId, currentPage])

  // Filter matches based on search term
  const filteredMatches = matches.filter(match => 
    match.match?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.promotion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        
        {/* Header */}
        <div className="relative z-20 px-4 lg:px-6 h-16 flex items-center backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Back to Profile
            </span>
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading match history...</p>
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
        
        {/* Header */}
        <div className="relative z-20 px-4 lg:px-6 h-16 flex items-center backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Back to Profile
            </span>
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Matches</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-20 px-4 lg:px-6 h-16 flex items-center backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
        <Link href={`/wrestler/${params.slug}?id=${wrestlerId}`} className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <ArrowLeft className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            Back to {wrestler?.name || 'Profile'}
          </span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-cyan-800 bg-clip-text text-transparent mb-2">
            {wrestler?.name} - Match History
          </h1>
          <p className="text-slate-600">Complete career match records</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/70 backdrop-blur-xl border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search matches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-slate-200"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-slate-300">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Matches List */}
        <Card className="bg-white/70 backdrop-blur-xl border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              Match Results ({filteredMatches.length} matches)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMatches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No matches found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match, index) => (
                  <div
                    key={`${match.date}-${index}`}
                    className="border border-slate-200/60 rounded-xl p-4 bg-gradient-to-br from-white/80 to-slate-100/60 hover:from-cyan-50 hover:to-purple-50 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{match.match}</h3>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p><strong>Date:</strong> {match.date}</p>
                          <p><strong>Promotion:</strong> {match.promotion}</p>
                          {match.location && <p><strong>Location:</strong> {match.location}</p>}
                          {match.duration && <p><strong>Duration:</strong> {match.duration}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {(currentPage > 1 || hasMore) && (
          <div className="flex justify-center gap-4">
            {currentPage > 1 && (
              <Link href={`/wrestler/${params.slug}/matches?id=${wrestlerId}&page=${currentPage - 1}`}>
                <Button variant="outline">Previous Page</Button>
              </Link>
            )}
            <span className="flex items-center px-4 py-2 text-sm text-slate-600">
              Page {currentPage}
            </span>
            {hasMore && (
              <Link href={`/wrestler/${params.slug}/matches?id=${wrestlerId}&page=${currentPage + 1}`}>
                <Button variant="outline">Next Page</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getFeaturedWrestlers, createSlug } from "@/lib/api"
import { FeaturedWrestler } from "@/types/wrestler"
import { FeaturedWrestlersSkeleton, ErrorState } from "@/components/loading-states"

export function WrestlerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredWrestlers, setFeaturedWrestlers] = useState<FeaturedWrestler[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch featured wrestlers from API
  useEffect(() => {
    const fetchFeaturedWrestlers = async () => {
      try {
        setLoading(true)
        setError(null)
        const wrestlers = await getFeaturedWrestlers()
        setFeaturedWrestlers(wrestlers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured wrestlers')
        console.error('Failed to fetch featured wrestlers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedWrestlers()
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (featuredWrestlers.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredWrestlers.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredWrestlers.length])

  const nextSlide = () => {
    if (featuredWrestlers.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % featuredWrestlers.length)
  }

  const prevSlide = () => {
    if (featuredWrestlers.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + featuredWrestlers.length) % featuredWrestlers.length)
  }

  const retryFetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const wrestlers = await getFeaturedWrestlers()
      setFeaturedWrestlers(wrestlers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load featured wrestlers')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return <FeaturedWrestlersSkeleton />
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load featured wrestlers"
        message={error}
        onRetry={retryFetch}
      />
    )
  }

  // Empty state
  if (featuredWrestlers.length === 0) {
    return (
      <ErrorState
        title="No featured wrestlers available"
        message="Check back later for featured wrestler profiles."
      />
    )
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredWrestlers.map((wrestler, index) => (
            <div key={wrestler.id} className="w-full flex-shrink-0">
              <Link href={`/wrestler/${createSlug(wrestler.name)}?id=${wrestler.id}`}>
                <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 overflow-hidden cursor-pointer hover:bg-white/80 transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-80 bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          {wrestler.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center bg-white/40">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {wrestler.name}
                          </h3>
                          <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0 shadow-sm">
                            {wrestler.promotion}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(wrestler.rating) ? "text-yellow-500 fill-current" : "text-slate-300"
                              }`}
                            />
                          ))}
                          <span className="text-slate-700 ml-2 font-medium">{wrestler.rating.toFixed(1)}/5.0</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-slate-600 text-sm font-medium">Total Matches</div>
                            <div className="text-slate-900 font-bold text-lg">{wrestler.totalMatches.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-600 text-sm font-medium">Win Rate</div>
                            <div className="text-emerald-600 font-bold text-lg">{wrestler.winRate.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600 text-sm font-medium mb-2">Current Titles</div>
                          <div className="flex flex-wrap gap-1">
                            {wrestler.currentTitles.length > 0 ? (
                              wrestler.currentTitles.map((title, i) => (
                                <Badge key={i} className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                                  {title}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">No current titles</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-xl border-slate-200/50 text-slate-700 hover:bg-white/80 shadow-lg hover:shadow-xl"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-xl border-slate-200/50 text-slate-700 hover:bg-white/80 shadow-lg hover:shadow-xl"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center mt-6 gap-2">
        {featuredWrestlers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 w-8 shadow-md"
                : "bg-slate-300 w-2 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

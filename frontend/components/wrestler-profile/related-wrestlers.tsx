"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getRelatedWrestlers } from "@/lib/api"
import ErrorBoundary from "@/components/error-boundary"

interface RelatedWrestlersProps {
  currentWrestler: {
    id: string
    name: string
  }
}

interface RelatedWrestler {
  id: string
  name: string
  nickname: string
  promotion: string
  rating: number
  relationship: string
  winRate: number
  matches: number
}

export function RelatedWrestlers({ currentWrestler }: RelatedWrestlersProps) {
  const [relatedWrestlers, setRelatedWrestlers] = useState<RelatedWrestler[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!currentWrestler?.id) return

    const fetchRelatedWrestlers = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        console.log('Fetching related wrestlers for:', currentWrestler.id)
        const relatedData = await getRelatedWrestlers(currentWrestler.id)
        console.log('Received related wrestlers:', relatedData.length)
        setRelatedWrestlers(relatedData)
      } catch (error) {
        console.error('Failed to fetch related wrestlers:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedWrestlers()
  }, [currentWrestler?.id])

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
            Related Wrestlers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
            Related Wrestlers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load related wrestlers</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
            Related Wrestlers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {relatedWrestlers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No related wrestlers found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedWrestlers.map((wrestler) => (
                <div key={wrestler.id} className="border border-slate-200/50 rounded-xl p-4 hover:bg-white/40 transition-all duration-200 hover:scale-105 cursor-pointer group backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {wrestler.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-900 font-semibold group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                        {wrestler.name}
                      </h4>
                      <p className="text-slate-500 text-sm truncate">"{wrestler.nickname}"</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0 text-xs shadow-sm">
                          {wrestler.promotion}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-slate-600 text-xs font-medium">{wrestler.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{wrestler.relationship}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-sm flex items-center justify-center">
                          <TrendingUp className="h-2 w-2 text-white" />
                        </div>
                        <span className="text-emerald-600 font-semibold">{wrestler.winRate}%</span>
                      </div>
                    </div>
                    <div className="text-slate-500 text-xs mt-1 font-medium">
                      {wrestler.matches.toLocaleString()} matches
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

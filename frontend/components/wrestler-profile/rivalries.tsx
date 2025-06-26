"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Swords, TrendingUp, TrendingDown } from "lucide-react"
import { getWrestlerRivalries } from "@/lib/api"
import ErrorBoundary from "@/components/error-boundary"

interface RivalriesProps {
  wrestlerId: string
}

interface Rivalry {
  id: string
  opponent: string
  matches: number
  wins: number
  losses: number
  winRate: number
  lastMatch: string
  rivalry: string
  notable: string
}

export function Rivalries({ wrestlerId }: RivalriesProps) {
  const [rivalries, setRivalries] = useState<Rivalry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!wrestlerId) return

    const fetchRivalries = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        console.log('Fetching rivalries for wrestler:', wrestlerId)
        const rivalriesData = await getWrestlerRivalries(wrestlerId)
        console.log('Received rivalries:', rivalriesData.length)
        setRivalries(rivalriesData)
      } catch (error) {
        console.error('Failed to fetch rivalries:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRivalries()
  }, [wrestlerId])

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
              <Swords className="h-4 w-4 text-white" />
            </div>
            Top Rivalries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
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
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
              <Swords className="h-4 w-4 text-white" />
            </div>
            Top Rivalries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load rivalries</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
              <Swords className="h-4 w-4 text-white" />
            </div>
            Top Rivalries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rivalries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No rivalries found</p>
            </div>
          ) : (
            rivalries.map((rivalry) => (
              <div
                key={rivalry.id}
                className="border border-slate-200/50 rounded-xl p-4 hover:bg-white/40 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-slate-900 font-semibold mb-1">{rivalry.opponent}</h4>
                    <p className="text-slate-600 text-sm font-medium">{rivalry.rivalry}</p>
                    <p className="text-slate-500 text-xs">{rivalry.notable}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {rivalry.winRate >= 60 ? (
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-rose-600 rounded-md flex items-center justify-center">
                          <TrendingDown className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <span className={`font-bold ${rivalry.winRate >= 60 ? "text-emerald-600" : "text-red-500"}`}>
                        {rivalry.winRate}%
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs">
                      {rivalry.wins}-{rivalry.losses} ({rivalry.matches} matches)
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 text-xs shadow-sm">
                      {rivalry.wins} Wins
                    </Badge>
                    <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 text-xs shadow-sm">
                      {rivalry.losses} Losses
                    </Badge>
                  </div>
                  <div className="text-slate-500 text-xs">
                    Last: {rivalry.lastMatch !== "Unknown" && rivalry.lastMatch.includes('-') 
                      ? new Date(rivalry.lastMatch).toLocaleDateString() 
                      : rivalry.lastMatch}
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                      rivalry.winRate >= 60
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                    }`}
                    style={{ width: `${Math.min(rivalry.winRate, 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

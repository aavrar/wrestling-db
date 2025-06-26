"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getWrestlerChampionships } from "@/lib/api"
import { Championship } from "@/types/wrestler"

interface ChampionshipHistoryProps {
  wrestlerId: string
}

export function ChampionshipHistory({ wrestlerId }: ChampionshipHistoryProps) {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getWrestlerChampionships(wrestlerId)
        setChampionships(data)
      } catch (err) {
        console.error('Failed to fetch championships:', err)
        setError('Failed to load championship history')
      } finally {
        setIsLoading(false)
      }
    }

    if (wrestlerId) {
      fetchChampionships()
    }
  }, [wrestlerId])
  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            Championship History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-slate-200/50 rounded-xl p-4 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-48"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="h-16 bg-slate-200 rounded-lg"></div>
                  <div className="h-16 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            Championship History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-orange-600 hover:text-orange-700 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (championships.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            Championship History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm">No championship history available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          Championship History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {championships.map((championship) => (
          <div
            key={championship.id}
            className="border border-slate-200/50 rounded-xl p-4 hover:bg-white/40 transition-all duration-200 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-slate-900 font-semibold">{championship.title}</h4>
                  {championship.current && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-sm">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 text-sm font-medium">{championship.promotion}</p>
              </div>
              <div className="text-right">
                <div className="text-orange-600 font-bold">
                  {(() => {
                    if (championship.current) {
                      return "Current Champion";
                    }
                    if (championship.wonDate && championship.lostDate) {
                      const wonDate = new Date(championship.wonDate);
                      const lostDate = new Date(championship.lostDate);
                      if (!isNaN(wonDate.getTime()) && !isNaN(lostDate.getTime())) {
                        const diffTime = Math.abs(lostDate.getTime() - wonDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return `${diffDays} days`;
                      }
                    }
                    return "Unknown duration";
                  })()}
                </div>
                <div className="text-slate-500 text-xs">{championship.defenses || 0} defenses</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200/50">
                <div className="flex items-center gap-2 text-emerald-700 mb-1 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>Championship Date: {new Date(championship.wonDate).toLocaleDateString()}</span>
                </div>
                {championship.current ? (
                  <div className="text-emerald-600 text-xs ml-5">Current Champion</div>
                ) : (
                  championship.lostDate && (
                    <div className="text-red-600 text-xs ml-5">
                      Until: {new Date(championship.lostDate).toLocaleDateString()}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

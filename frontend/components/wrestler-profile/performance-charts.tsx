"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWrestlerPerformanceData } from "@/lib/api"
import ErrorBoundary from "@/components/error-boundary"

interface PerformanceChartsProps {
  wrestlerId: string
}

interface MonthlyStats {
  month: string
  wins: number
  losses: number
  winRate: number
  matches: number
}

interface MatchTypeStats {
  type: string
  matches: number
  wins: number
  percentage: number
}

export function PerformanceCharts({ wrestlerId }: PerformanceChartsProps) {
  const [activeChart, setActiveChart] = useState<"monthly" | "matchType">("monthly")
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyStats[]>([])
  const [matchTypeStats, setMatchTypeStats] = useState<MatchTypeStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!wrestlerId) return

    const fetchPerformanceData = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        console.log('Fetching performance data for wrestler:', wrestlerId)
        const performanceData = await getWrestlerPerformanceData(wrestlerId)
        console.log('Received performance data:', performanceData)
        setMonthlyPerformance(performanceData.monthlyData)
        setMatchTypeStats(performanceData.matchTypeStats)
      } catch (error) {
        console.error('Failed to fetch performance data:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformanceData()
  }, [wrestlerId])

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Performance Analytics
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
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load performance data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              Performance Analytics
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeChart === "monthly" ? "default" : "outline"}
                onClick={() => setActiveChart("monthly")}
                className={
                  activeChart === "monthly"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }
              >
                Monthly
              </Button>
              <Button
                size="sm"
                variant={activeChart === "matchType" ? "default" : "outline"}
                onClick={() => setActiveChart("matchType")}
                className={
                  activeChart === "matchType"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }
              >
                Match Types
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeChart === "monthly" && (
            <div className="space-y-4">
              <h4 className="text-slate-900 font-semibold flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                Monthly Performance
              </h4>
              {monthlyPerformance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">No monthly data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monthlyPerformance.map((month, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700 font-medium">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-emerald-600 font-semibold">{month.wins}W</span>
                          <span className="text-red-500 font-semibold">{month.losses}L</span>
                          <span className="text-slate-900 font-bold">{month.winRate}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${Math.min(month.winRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeChart === "matchType" && (
            <div className="space-y-4">
              <h4 className="text-slate-900 font-semibold flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                  <PieChart className="h-3 w-3 text-white" />
                </div>
                Performance by Match Type
              </h4>
              {matchTypeStats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">No match type data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchTypeStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700 font-medium">{stat.type}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-600">
                            {stat.wins}/{stat.matches}
                          </span>
                          <span className="text-slate-900 font-bold">{stat.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

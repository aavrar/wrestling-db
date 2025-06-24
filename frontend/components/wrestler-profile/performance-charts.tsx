"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, PieChart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PerformanceChartsProps {
  wrestlerId: string
}

const monthlyPerformance = [
  { month: "Jan", wins: 4, losses: 1, winRate: 80 },
  { month: "Feb", wins: 3, losses: 2, winRate: 60 },
  { month: "Mar", wins: 5, losses: 0, winRate: 100 },
  { month: "Apr", wins: 3, losses: 1, winRate: 75 },
  { month: "May", wins: 4, losses: 2, winRate: 67 },
  { month: "Jun", wins: 6, losses: 1, winRate: 86 },
]

const matchTypeStats = [
  { type: "Singles", matches: 892, wins: 698, percentage: 78.3 },
  { type: "Tag Team", matches: 234, wins: 187, percentage: 79.9 },
  { type: "Triple Threat", matches: 67, wins: 45, percentage: 67.2 },
  { type: "Fatal 4-Way", matches: 34, wins: 28, percentage: 82.4 },
  { type: "Royal Rumble", matches: 8, wins: 2, percentage: 25.0 },
  { type: "Ladder Match", matches: 12, wins: 8, percentage: 66.7 },
]

export function PerformanceCharts({ wrestlerId }: PerformanceChartsProps) {
  const [activeChart, setActiveChart] = useState<"monthly" | "matchType">("monthly")

  return (
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
              Monthly Win Rate (2024)
            </h4>
            <div className="space-y-4">
              {monthlyPerformance.map((month) => (
                <div key={month.month} className="space-y-2">
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
                      style={{ width: `${month.winRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {matchTypeStats.map((stat) => (
                <div key={stat.type} className="space-y-2">
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
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

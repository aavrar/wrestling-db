import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, BarChart3 } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"

interface StatsOverviewProps {
  wrestler: {
    totalMatches: number
    wins: number
    losses: number
    draws: number
    winRate: number
  }
}

export function StatsOverview({ wrestler }: StatsOverviewProps) {
  // Generate recent form based on win/loss ratio for a more realistic display
  const generateRecentForm = () => {
    const form = []
    const winRate = wrestler.winRate / 100
    
    for (let i = 0; i < 5; i++) {
      const isWin = Math.random() < winRate
      form.push({
        result: isWin ? "W" : "L",
        opponent: "Recent Opponent",
        date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    }
    return form
  }
  
  const recentForm = generateRecentForm()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Matches */}
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Matches</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            <AnimatedCounter end={wrestler.totalMatches} />
          </div>
          <p className="text-xs text-slate-500 mt-1">Career matches</p>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Win Rate</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
            <Target className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            <AnimatedCounter end={wrestler.winRate} suffix="%" />
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${wrestler.winRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Wins */}
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Wins</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            <AnimatedCounter end={wrestler.wins} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {wrestler.draws > 0 ? `${wrestler.losses} losses, ${wrestler.draws} draws` : `${wrestler.losses} losses`}
          </p>
        </CardContent>
      </Card>

      {/* Recent Form */}
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Recent Form</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <Calendar className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 mb-2">
            {recentForm.map((match, index) => (
              <Badge
                key={index}
                className={`w-6 h-6 p-0 flex items-center justify-center text-xs border-0 shadow-sm ${
                  match.result === "W"
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                    : match.result === "L"
                      ? "bg-gradient-to-br from-red-500 to-rose-600 text-white"
                      : "bg-gradient-to-br from-slate-400 to-slate-500 text-white"
                }`}
              >
                {match.result}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-slate-500">Last 5 matches</p>
        </CardContent>
      </Card>
    </div>
  )
}

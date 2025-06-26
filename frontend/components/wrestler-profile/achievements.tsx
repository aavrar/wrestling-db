"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Star, Trophy, Target, Calendar, TrendingUp } from "lucide-react"
import { getWrestlerAchievements } from "@/lib/api"
import ErrorBoundary from "@/components/error-boundary"

interface AchievementsProps {
  wrestlerId: string
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: string
  significance: 'high' | 'medium' | 'low'
}

const achievementIcons = {
  championship: Trophy,
  career_stat: Award,
  match: Star,
  record: TrendingUp,
  award: Award,
  debut: Calendar,
  other: Target
}

const achievementColors = {
  championship: "from-yellow-500 to-orange-500",
  career_stat: "from-emerald-500 to-teal-500", 
  match: "from-purple-500 to-pink-500",
  record: "from-orange-500 to-red-500",
  award: "from-blue-500 to-cyan-500",
  debut: "from-slate-500 to-slate-600",
  other: "from-indigo-500 to-purple-500"
}

export function Achievements({ wrestlerId }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!wrestlerId) return

    const fetchAchievements = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        console.log('Fetching achievements for wrestler:', wrestlerId)
        const achievementsData = await getWrestlerAchievements(wrestlerId)
        console.log('Received achievements:', achievementsData.length)
        setAchievements(achievementsData)
      } catch (error) {
        console.error('Failed to fetch achievements:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [wrestlerId])

  // Calculate career stats from achievements
  const careerStats = [
    { 
      label: "Total Achievements", 
      value: achievements.length.toString(), 
      icon: Award, 
      color: "from-yellow-500 to-orange-500" 
    },
    { 
      label: "Championships", 
      value: achievements.filter(a => a.type === 'championship').length.toString(), 
      icon: Trophy, 
      color: "from-purple-500 to-pink-500" 
    },
    { 
      label: "Career Stats", 
      value: achievements.filter(a => a.type === 'career_stat').length.toString(), 
      icon: Target, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      label: "Records", 
      value: achievements.filter(a => a.type === 'record').length.toString(), 
      icon: TrendingUp, 
      color: "from-emerald-500 to-teal-500" 
    },
  ]

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <Award className="h-4 w-4 text-white" />
            </div>
            Achievements & Records
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
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <Award className="h-4 w-4 text-white" />
            </div>
            Achievements & Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load achievements</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <Award className="h-4 w-4 text-white" />
            </div>
            Achievements & Records
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Career Stats */}
          <div className="grid grid-cols-2 gap-4">
            {careerStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={index}
                  className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/60 transition-colors duration-200"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Achievements List */}
          {achievements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No achievements found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const IconComponent = achievementIcons[achievement.type as keyof typeof achievementIcons] || Award
                const color = achievementColors[achievement.type as keyof typeof achievementColors] || "from-indigo-500 to-purple-500"
                
                return (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-4 p-4 border border-slate-200/50 rounded-xl hover:bg-white/40 transition-all duration-200 backdrop-blur-sm"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${color} shadow-md`}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-slate-900 font-semibold text-sm">{achievement.title}</h4>
                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          {achievement.type}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{achievement.description}</p>
                      {achievement.date && (
                        <p className="text-slate-500 text-xs mt-1">Year: {achievement.date}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

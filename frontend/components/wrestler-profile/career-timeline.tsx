"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimerIcon as Timeline, Trophy, Star, Users, Briefcase, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getWrestlerTimeline } from "@/lib/api"
import { TimelineEvent } from "@/types/wrestler"

interface CareerTimelineProps {
  wrestlerId: string
}

// Helper function to get icon and color based on timeline event type
const getEventDisplay = (type: string) => {
  switch (type) {
    case 'championship':
      return { icon: Trophy, color: 'from-yellow-500 to-orange-500' }
    case 'debut':
      return { icon: Briefcase, color: 'from-emerald-500 to-teal-500' }
    case 'major_match':
    case 'milestone':
      return { icon: Star, color: 'from-purple-500 to-pink-500' }
    case 'injury':
    case 'retirement':
    case 'return':
      return { icon: Star, color: 'from-blue-500 to-cyan-500' }
    default:
      return { icon: Star, color: 'from-slate-500 to-gray-500' }
  }
}

export function CareerTimeline({ wrestlerId }: CareerTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getWrestlerTimeline(wrestlerId)
        setTimelineEvents(data)
      } catch (err) {
        console.error('Failed to fetch timeline:', err)
        setError('Failed to load career timeline')
      } finally {
        setIsLoading(false)
      }
    }

    if (wrestlerId) {
      fetchTimeline()
    }
  }, [wrestlerId])

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Timeline className="h-4 w-4 text-white" />
            </div>
            Career Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500 shadow-sm"></div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 animate-pulse shadow-lg border-2 border-white"></div>
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="p-4 bg-slate-200 animate-pulse rounded-xl h-20"></div>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Timeline className="h-4 w-4 text-white" />
            </div>
            Career Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (timelineEvents.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Timeline className="h-4 w-4 text-white" />
            </div>
            Career Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <div className="text-center">
              <Timeline className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm">No timeline events available</p>
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
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <Timeline className="h-4 w-4 text-white" />
          </div>
          Career Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500 shadow-sm"></div>

          <div className="space-y-6">
            {timelineEvents.map((event, index) => {
              const { icon: IconComponent, color } = getEventDisplay(event.type)
              return (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${color} shadow-lg border-2 border-white`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/60 transition-colors duration-200">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-slate-900 font-semibold">{event.title}</h4>
                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>
                        {event.promotion && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            {event.promotion}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

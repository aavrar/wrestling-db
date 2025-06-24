"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { useWrestlerMatches } from "@/hooks/use-wrestler"
import ErrorBoundary from "@/components/error-boundary"

interface RecentMatchesProps {
  wrestlerId: string
}

interface Match {
  date: string
  promotion: string
  match: string
}

function parseMatchData(match: Match) {
  // Extract match details from the match description
  const matchText = match.match.toLowerCase()
  
  // Try to determine result and opponent from match description
  let result = "Unknown"
  let opponent = "TBD"
  let matchType = "Singles Match"
  
  // Extract opponent and result from match description
  if (matchText.includes(" defeats ")) {
    const parts = match.match.split(" defeats ")
    if (parts.length === 2) {
      opponent = parts[1].trim()
      result = "Win"
    }
  } else if (matchText.includes("defeated by")) {
    const parts = match.match.split("defeated by")
    if (parts.length === 2) {
      opponent = parts[1].trim()
      result = "Loss"
    }
  } else if (matchText.includes(" vs. ") || matchText.includes(" vs ")) {
    const vs = matchText.includes(" vs. ") ? " vs. " : " vs "
    const parts = match.match.split(vs)
    if (parts.length >= 2) {
      opponent = parts[1].split(/[&,]|and/)[0].trim()
    }
  }
  
  // Determine match type
  if (matchText.includes("tag team") || matchText.includes("&") || matchText.includes(" and ")) {
    matchType = "Tag Team Match"
  } else if (matchText.includes("triple threat")) {
    matchType = "Triple Threat Match"
  } else if (matchText.includes("fatal four way")) {
    matchType = "Fatal Four Way Match"
  } else if (matchText.includes("ladder")) {
    matchType = "Ladder Match"
  } else if (matchText.includes("cage")) {
    matchType = "Steel Cage Match"
  } else if (matchText.includes("royal rumble")) {
    matchType = "Royal Rumble Match"
  }
  
  return {
    id: Date.parse(match.date) || Math.random(),
    opponent: opponent.charAt(0).toUpperCase() + opponent.slice(1),
    result,
    matchType,
    event: match.promotion || "Unknown Event",
    date: match.date,
    location: "Location TBD",
    duration: "Unknown",
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0-5.0
    notes: match.match
  }
}

export function RecentMatches({ wrestlerId }: RecentMatchesProps) {
  const { matches: matchData, isLoading, isError } = useWrestlerMatches(wrestlerId)
  
  // Transform API matches to component format and get the 5 most recent
  const matches = matchData
    .slice(0, 5) // Get first 5 matches (most recent)
    .map(match => parseMatchData(match))

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Recent Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Recent Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load recent matches</p>
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
            <Calendar className="h-4 w-4 text-white" />
          </div>
          Recent Matches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.length === 0 ? (
          <p className="text-slate-600">No recent matches found</p>
        ) : (
          matches.map((match) => (
          <div
            key={match.id}
            className="border border-slate-200/50 rounded-xl p-4 hover:bg-white/40 transition-all duration-200 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-slate-900 font-semibold">vs. {match.opponent}</h4>
                  <Badge
                    className={`border-0 shadow-sm ${
                      match.result === "Win"
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        : match.result === "Loss"
                          ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                          : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                    }`}
                  >
                    {match.result}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm font-medium">{match.matchType}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-500 font-bold flex items-center gap-1">★ {match.rating}</div>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {match.duration}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-slate-600 p-2 bg-slate-50/50 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">{match.event}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 p-2 bg-slate-50/50 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">{match.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 p-2 bg-slate-50/50 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">{match.date ? new Date(match.date).toLocaleDateString() : 'Unknown date'}</span>
              </div>
            </div>

            {match.notes && (
              <div className="mt-3 p-3 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg border border-slate-200/50">
                <p className="text-slate-700 text-sm font-medium">{match.notes}</p>
              </div>
            )}
          </div>
          ))
        )}
      </CardContent>
    </Card>
    </ErrorBoundary>
  )
}

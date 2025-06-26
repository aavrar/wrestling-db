// components/RecentMatches.tsx

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getWrestlerRecentMatches } from "@/lib/api"
import ErrorBoundary from "@/components/error-boundary"

interface RecentMatchesProps {
  wrestlerId: string
}

interface Match {
  date: string
  promotion: string
  match: string
  location?: string
  duration?: string
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  // Try ISO first
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr)
  }
  // Try DD.MM.YYYY
  const match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})/)
  if (match) {
    const [_, d, m, y] = match
    return new Date(`${y}-${m}-${d}`)
  }
  // Try MM/DD/YYYY
  const usMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (usMatch) {
    const [_, m, d, y] = usMatch
    return new Date(`${y}-${m}-${d}`)
  }
  return null
}

function parseMatchData(match: Match) {
  const matchText = match.match?.toLowerCase() || ""
  const originalMatch = match.match || ""
  let result = "Unknown"
  let opponent = "TBD"
  let matchType = "Singles Match"

  // Handle draws and no contests first
  if (matchText.match(/draw|no contest|time limit/)) {
    result = "Draw"
    const vsMatch = originalMatch.match(/vs\.?\s+([^,&]+)/i)
    if (vsMatch) {
      opponent = vsMatch[1].split(/\s+at\s+|\s+in\s+/i)[0].trim()
    }
  }
  // Handle clear wins - look for "defeats", "pins", "submits", "beat", "wins"
  else if (matchText.includes("defeats") || matchText.includes("pins") || 
           matchText.includes("submits") || matchText.includes("beat") ||
           matchText.includes("wins")) {
    const patterns = [
      /defeats\s+([^,&]+)/i,
      /pins\s+([^,&]+)/i, 
      /submits\s+([^,&]+)/i,
      /beat\s+([^,&]+)/i,
      /wins.*?against\s+([^,&]+)/i
    ]
    
    for (const pattern of patterns) {
      const matchResult = originalMatch.match(pattern)
      if (matchResult) {
        opponent = matchResult[1].split(/\s+at\s+|\s+in\s+/i)[0].trim()
        result = "Win"
        break
      }
    }
  }
  // Handle clear losses - look for "defeated by", "pinned by", "submitted by"
  else if (matchText.includes("defeated by") || matchText.includes("pinned by") || 
           matchText.includes("submitted by") || matchText.includes("loses")) {
    const patterns = [
      /defeated by\s+([^,&]+)/i,
      /pinned by\s+([^,&]+)/i,
      /submitted by\s+([^,&]+)/i,
      /loses.*?to\s+([^,&]+)/i
    ]
    
    for (const pattern of patterns) {
      const matchResult = originalMatch.match(pattern)
      if (matchResult) {
        opponent = matchResult[1].split(/\s+at\s+|\s+in\s+/i)[0].trim()
        result = "Loss"
        break
      }
    }
  }
  // Handle tag team matches
  else if (matchText.includes("&") || matchText.includes(" and ") || matchText.includes("tag")) {
    matchType = "Tag Team Match"
    
    // Try to extract opponent team or individual from tag match
    if (matchText.includes("defeats") || matchText.includes("beat")) {
      const teamPatterns = [
        /&\s*[^&]*\s*defeat[s]?\s+([^,&]+)/i,
        /and\s+[^&]*\s*defeat[s]?\s+([^,&]+)/i
      ]
      
      for (const pattern of teamPatterns) {
        const matchResult = originalMatch.match(pattern)
        if (matchResult) {
          opponent = matchResult[1].split(/\s+at\s+|\s+in\s+/i)[0].trim()
          result = "Win"
          break
        }
      }
    } else if (matchText.includes("defeated by") || matchText.includes("lose")) {
      const lossPatterns = [
        /defeated by\s+([^,&]+)/i,
        /lose.*?to\s+([^,&]+)/i
      ]
      
      for (const pattern of lossPatterns) {
        const matchResult = originalMatch.match(pattern)
        if (matchResult) {
          opponent = matchResult[1].split(/\s+at\s+|\s+in\s+/i)[0].trim()
          result = "Loss"
          break
        }
      }
    } else {
      // For unclear tag matches, try to extract any vs. opponent
      const vsMatch = originalMatch.match(/vs\.?\s+([^,&]+)/i)
      if (vsMatch) {
        opponent = vsMatch[1].split(/\s+at\s+|\s+in\s+/i)[0].trim()
      }
    }
  }
  // Handle multi-man matches
  else if (matchText.includes("triple threat") || matchText.includes("fatal four") || 
           matchText.includes("battle royal") || matchText.includes("rumble") ||
           matchText.match(/\d+-way/)) {
    if (matchText.includes("triple threat")) matchType = "Triple Threat Match"
    else if (matchText.includes("fatal four")) matchType = "Fatal Four Way Match"
    else if (matchText.includes("battle royal")) matchType = "Battle Royal Match"
    else if (matchText.includes("rumble")) matchType = "Royal Rumble Match"
    else matchType = "Multi-Man Match"
    
    // Check for victory in multi-man match
    if (matchText.includes("wins") || matchText.includes("winner")) {
      result = "Win"
      opponent = "Multiple Opponents"
    } else if (matchText.includes("eliminated") || matchText.includes("loses")) {
      result = "Loss" 
      opponent = "Multiple Opponents"
    } else {
      opponent = "Multiple Opponents"
    }
  }
  // Handle standard vs. matches
  else if (matchText.includes(" vs. ") || matchText.includes(" vs ")) {
    const vs = matchText.includes(" vs. ") ? " vs. " : " vs "
    const parts = originalMatch.split(new RegExp(vs, 'i'))
    if (parts.length >= 2) {
      opponent = parts[1].split(/[,]|\s+at\s+|\s+in\s+/i)[0].trim()
    }
    
    // Try to determine result from context
    if (matchText.includes("over") || matchText.includes("winner")) {
      result = "Win"
    } else if (matchText.includes("loses") || matchText.includes("loser")) {
      result = "Loss"
    }
  }

  // Determine match type based on keywords
  if (matchText.includes("ladder")) {
    matchType = "Ladder Match"
  } else if (matchText.includes("cage")) {
    matchType = "Steel Cage Match"
  } else if (matchText.includes("hell in a cell")) {
    matchType = "Hell in a Cell Match"
  } else if (matchText.includes("tables")) {
    matchType = "Tables Match"
  } else if (matchText.includes("hardcore")) {
    matchType = "Hardcore Match"
  }

  const id = `${match.date}-${match.match}`

  return {
    id,
    opponent: opponent.charAt(0).toUpperCase() + opponent.slice(1),
    result,
    matchType,
    event: match.promotion || "Unknown Event",
    date: match.date,
    location: match.location || "TBD",
    duration: match.duration || "—",
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    notes: originalMatch
  }
}

export function RecentMatches({ wrestlerId }: RecentMatchesProps) {
  const [matchData, setMatchData] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!wrestlerId) return

    const fetchRecentMatches = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        console.log('Fetching recent matches for wrestler:', wrestlerId)
        const matches = await getWrestlerRecentMatches(wrestlerId, 5)
        console.log('Received matches:', matches.length)
        setMatchData(matches)
      } catch (error) {
        console.error('Failed to fetch recent matches:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentMatches()
  }, [wrestlerId])

  // Defensive: ensure matchData is an array
  const safeMatches: Match[] = Array.isArray(matchData) ? matchData : []

  // Filter out matches with no date or match string
  const filteredMatches = safeMatches.filter(
    m => m && m.date && m.match && parseDate(m.date)
  )

  // Sort by date descending
  const sortedMatches = filteredMatches
    .slice()
    .sort((a, b) => {
      const da = parseDate(a.date)
      const db = parseDate(b.date)
      if (!da && !db) return 0
      if (!da) return 1
      if (!db) return -1
      return db.getTime() - da.getTime()
    })

  // Take 5 most recent
  const matches = sortedMatches.slice(0, 5).map(parseMatchData)

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-xl border-slate-200/50 shadow-lg">
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
      <Card className="bg-white/70 backdrop-blur-xl border-slate-200/50 shadow-lg">
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
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Recent Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {matches.length === 0 ? (
            <div>
              <p className="text-slate-600">No recent matches found</p>
              {safeMatches.length === 0 && (
                <p className="text-xs text-rose-500 mt-2">
                  No matches returned from the API. Check your backend or wrestler ID.
                </p>
              )}
              {safeMatches.length > 0 && filteredMatches.length === 0 && (
                <p className="text-xs text-rose-500 mt-2">
                  Matches returned, but all have missing or invalid dates.
                </p>
              )}
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="border border-slate-200/60 rounded-xl p-4 bg-gradient-to-br from-white/80 to-slate-100/60 hover:from-cyan-50 hover:to-purple-50 transition-all duration-200 shadow-sm group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-slate-900 font-semibold">
                        vs. <span className="group-hover:text-cyan-700 transition">{match.opponent}</span>
                      </h4>
                      <Badge
                        className={`border-0 shadow-sm px-3 py-1 text-xs font-bold tracking-wide ${
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 p-2 bg-slate-50/70 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{match.event}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 p-2 bg-slate-50/70 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{match.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 p-2 bg-slate-50/70 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">
                      {match.date
                        ? (() => {
                            const d = parseDate(match.date)
                            return d ? d.toLocaleDateString() : match.date
                          })()
                        : 'Unknown date'}
                    </span>
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
          
          {/* View All Matches Button */}
          {matches.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200/50">
              <Link href={`/wrestler/${wrestlerId}/matches?id=${wrestlerId}`} passHref>
                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-cyan-50 to-purple-50 hover:from-cyan-100 hover:to-purple-100 border-slate-200 text-slate-700 hover:text-slate-900 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Match History
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

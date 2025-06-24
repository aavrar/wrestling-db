import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

interface RelatedWrestlersProps {
  currentWrestler: {
    id: string
    name: string
  }
}

const relatedWrestlers = [
  {
    id: "seth-rollins",
    name: "Seth Rollins",
    nickname: "The Visionary",
    promotion: "WWE",
    rating: 4.7,
    relationship: "Former Shield Member",
    image: "/placeholder.svg?height=80&width=80",
    winRate: 74.2,
    matches: 1156,
  },
  {
    id: "dean-ambrose",
    name: "Jon Moxley",
    nickname: "The Purveyor of Violence",
    promotion: "AEW",
    rating: 4.6,
    relationship: "Former Shield Member",
    image: "/placeholder.svg?height=80&width=80",
    winRate: 71.8,
    matches: 892,
  },
  {
    id: "cody-rhodes",
    name: "Cody Rhodes",
    nickname: "The American Nightmare",
    promotion: "WWE",
    rating: 4.8,
    relationship: "Current Rival",
    image: "/placeholder.svg?height=80&width=80",
    winRate: 76.3,
    matches: 1034,
  },
  {
    id: "brock-lesnar",
    name: "Brock Lesnar",
    nickname: "The Beast Incarnate",
    promotion: "WWE",
    rating: 4.9,
    relationship: "Long-time Rival",
    image: "/placeholder.svg?height=80&width=80",
    winRate: 82.1,
    matches: 456,
  },
  {
    id: "cm-punk",
    name: "CM Punk",
    nickname: "The Second City Saint",
    promotion: "WWE",
    rating: 4.9,
    relationship: "Recent Opponent",
    image: "/placeholder.svg?height=80&width=80",
    winRate: 79.4,
    matches: 892,
  },
]

export function RelatedWrestlers({ currentWrestler }: RelatedWrestlersProps) {
  return (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedWrestlers.map((wrestler) => (
            <Link key={wrestler.id} href={`/wrestler/${wrestler.id}`}>
              <div className="border border-slate-200/50 rounded-xl p-4 hover:bg-white/40 transition-all duration-200 hover:scale-105 cursor-pointer group backdrop-blur-sm">
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
                        <span className="text-slate-600 text-xs font-medium">{wrestler.rating}</span>
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
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

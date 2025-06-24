import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Swords, TrendingUp, TrendingDown } from "lucide-react"

interface RivalriesProps {
  wrestlerId: string
}

const rivalries = [
  {
    id: 1,
    opponent: "Cody Rhodes",
    matches: 8,
    wins: 5,
    losses: 3,
    winRate: 62.5,
    lastMatch: "2024-01-27",
    rivalry: "Championship Feud",
    notable: "WrestleMania 39 & 40 main events",
  },
  {
    id: 2,
    opponent: "Brock Lesnar",
    matches: 12,
    wins: 7,
    losses: 5,
    winRate: 58.3,
    lastMatch: "2022-04-03",
    rivalry: "Universal Championship",
    notable: "Multiple WrestleMania encounters",
  },
  {
    id: 3,
    opponent: "Seth Rollins",
    matches: 15,
    wins: 9,
    losses: 6,
    winRate: 60.0,
    lastMatch: "2024-01-01",
    rivalry: "Former Shield Brothers",
    notable: "Shield reunion and breakup",
  },
  {
    id: 4,
    opponent: "Drew McIntyre",
    matches: 6,
    wins: 4,
    losses: 2,
    winRate: 66.7,
    lastMatch: "2023-11-04",
    rivalry: "Championship Contender",
    notable: "Clash at the Castle series",
  },
  {
    id: 5,
    opponent: "Kevin Owens",
    matches: 9,
    wins: 6,
    losses: 3,
    winRate: 66.7,
    lastMatch: "2023-09-15",
    rivalry: "Sami Zayn Alliance",
    notable: "Bloodline storyline involvement",
  },
]

export function Rivalries({ wrestlerId }: RivalriesProps) {
  return (
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
        {rivalries.map((rivalry) => (
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
              <div className="text-slate-500 text-xs">Last: {new Date(rivalry.lastMatch).toLocaleDateString()}</div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                  rivalry.winRate >= 60
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "bg-gradient-to-r from-red-500 to-rose-500"
                }`}
                style={{ width: `${rivalry.winRate}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

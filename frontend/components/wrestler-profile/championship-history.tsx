import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar } from "lucide-react"

interface ChampionshipHistoryProps {
  wrestlerId: string
}

const championships = [
  {
    id: 1,
    title: "Undisputed WWE Universal Championship",
    promotion: "WWE",
    wonDate: "2022-04-03",
    lostDate: null,
    daysHeld: 650,
    defenses: 15,
    wonFrom: "Brock Lesnar",
    lostTo: null,
    location: "AT&T Stadium, Arlington, TX",
    event: "WrestleMania 38",
    current: true,
  },
  {
    id: 2,
    title: "WWE Universal Championship",
    promotion: "WWE",
    wonDate: "2020-08-30",
    lostDate: "2022-04-03",
    daysHeld: 581,
    defenses: 12,
    wonFrom: "Braun Strowman & The Fiend",
    lostTo: "Unified with WWE Championship",
    location: "ThunderDome, Orlando, FL",
    event: "WWE Payback 2020",
    current: false,
  },
  {
    id: 3,
    title: "WWE Championship",
    promotion: "WWE",
    wonDate: "2015-11-22",
    lostDate: "2015-12-14",
    daysHeld: 22,
    defenses: 0,
    wonFrom: "Dean Ambrose",
    lostTo: "Sheamus",
    location: "Survivor Series",
    event: "WWE Survivor Series 2015",
    current: false,
  },
  {
    id: 4,
    title: "WWE Tag Team Championship",
    promotion: "WWE",
    wonDate: "2012-05-20",
    lostDate: "2013-05-19",
    daysHeld: 364,
    defenses: 8,
    wonFrom: "Kofi Kingston & R-Truth",
    lostTo: "Team Hell No",
    location: "Allstate Arena, Chicago, IL",
    event: "WWE Over the Limit 2012",
    current: false,
    partner: "Seth Rollins (The Shield)",
  },
]

export function ChampionshipHistory({ wrestlerId }: ChampionshipHistoryProps) {
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
                {championship.partner && <p className="text-slate-500 text-sm">w/ {championship.partner}</p>}
              </div>
              <div className="text-right">
                <div className="text-orange-600 font-bold">{championship.daysHeld} days</div>
                <div className="text-slate-500 text-xs">{championship.defenses} defenses</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200/50">
                <div className="flex items-center gap-2 text-emerald-700 mb-1 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>Won: {new Date(championship.wonDate).toLocaleDateString()}</span>
                </div>
                <div className="text-emerald-600 text-xs ml-5">
                  from {championship.wonFrom} at {championship.event}
                </div>
              </div>

              {championship.lostDate && (
                <div className="p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-200/50">
                  <div className="flex items-center gap-2 text-red-700 mb-1 font-medium">
                    <Calendar className="h-3 w-3" />
                    <span>Lost: {new Date(championship.lostDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-red-600 text-xs ml-5">to {championship.lostTo}</div>
                </div>
              )}
            </div>

            <div className="mt-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
              <p className="text-slate-700 text-xs font-medium">
                <strong>Location:</strong> {championship.location}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

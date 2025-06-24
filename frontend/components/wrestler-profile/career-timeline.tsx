import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimerIcon as Timeline, Trophy, Star, Users, Briefcase } from "lucide-react"

interface CareerTimelineProps {
  wrestlerId: string
}

const timelineEvents = [
  {
    id: 1,
    date: "2024-01-27",
    title: "Retained Undisputed Championship",
    description: "Successfully defended against Cody Rhodes at Royal Rumble",
    type: "match",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 2,
    date: "2023-04-01",
    title: "WrestleMania 39 Main Event",
    description: "Headlined Night 1 of WrestleMania against Cody Rhodes",
    type: "milestone",
    icon: Star,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    date: "2022-04-03",
    title: "Became Undisputed Champion",
    description: "Unified WWE and Universal Championships by defeating Brock Lesnar",
    type: "championship",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 4,
    date: "2020-08-30",
    title: "Won Universal Championship",
    description: "Defeated Braun Strowman and The Fiend in Triple Threat Match",
    type: "championship",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 5,
    date: "2020-02-27",
    title: "Returned from Leukemia",
    description: "Made emotional return after battling leukemia",
    type: "milestone",
    icon: Star,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 6,
    date: "2018-10-22",
    title: "Announced Leukemia Battle",
    description: "Revealed leukemia diagnosis and relinquished Universal Championship",
    type: "personal",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 7,
    date: "2016-04-03",
    title: "WrestleMania 32 Main Event",
    description: "Defeated Triple H for WWE Championship in main event",
    type: "milestone",
    icon: Star,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 8,
    date: "2014-06-02",
    title: "The Shield Disbanded",
    description: "Seth Rollins turned on The Shield, ending the faction",
    type: "faction",
    icon: Users,
    color: "from-red-500 to-rose-500",
  },
  {
    id: 9,
    date: "2012-11-18",
    title: "WWE Debut",
    description: "Debuted as part of The Shield at Survivor Series",
    type: "debut",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-500",
  },
]

export function CareerTimeline({ wrestlerId }: CareerTimelineProps) {
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
              const IconComponent = event.icon
              return (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${event.color} shadow-lg border-2 border-white`}
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

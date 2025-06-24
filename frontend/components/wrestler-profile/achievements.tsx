import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Star, Trophy, Target, Calendar, TrendingUp } from "lucide-react"

interface AchievementsProps {
  wrestlerId: string
}

const achievements = [
  {
    id: 1,
    title: "Longest Reigning Universal Champion",
    description: "Held the Universal Championship for 581 days (2020-2022)",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    category: "Championship Record",
  },
  {
    id: 2,
    title: "WrestleMania Main Eventer",
    description: "Headlined WrestleMania 32, 37, 38, 39, and 40",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    category: "WrestleMania",
  },
  {
    id: 3,
    title: "Royal Rumble Winner",
    description: "Won the 2015 Royal Rumble Match",
    icon: Award,
    color: "from-blue-500 to-cyan-500",
    category: "Royal Rumble",
  },
  {
    id: 4,
    title: "Slammy Award Winner",
    description: "Superstar of the Year (2014)",
    icon: Award,
    color: "from-emerald-500 to-teal-500",
    category: "Awards",
  },
  {
    id: 5,
    title: "Most Consecutive PPV Main Events",
    description: "Headlined 25 consecutive pay-per-view events",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    category: "Streak Record",
  },
  {
    id: 6,
    title: "Highest Rated Match",
    description: "5-star match vs CM Punk at Survivor Series 2023",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    category: "Match Rating",
  },
]

const careerStats = [
  { label: "Championship Reigns", value: "7", icon: Trophy, color: "from-yellow-500 to-orange-500" },
  { label: "WrestleMania Main Events", value: "5", icon: Star, color: "from-purple-500 to-pink-500" },
  { label: "Pay-Per-View Wins", value: "89", icon: Target, color: "from-blue-500 to-cyan-500" },
  { label: "Years Active", value: "12", icon: Calendar, color: "from-emerald-500 to-teal-500" },
]

export function Achievements({ wrestlerId }: AchievementsProps) {
  return (
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
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon
            return (
              <div
                key={achievement.id}
                className="flex items-start gap-4 p-4 border border-slate-200/50 rounded-xl hover:bg-white/40 transition-all duration-200 backdrop-blur-sm"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${achievement.color} shadow-md`}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-slate-900 font-semibold text-sm">{achievement.title}</h4>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                      {achievement.category}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{achievement.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

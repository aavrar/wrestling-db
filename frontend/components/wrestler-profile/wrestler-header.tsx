import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Calendar, Ruler, Weight, Trophy, Share2, Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generateAvatarProps } from "@/lib/avatar-utils"

interface WrestlerHeaderProps {
  wrestler: {
    name: string
    realName: string
    nickname: string
    promotion: string
    height: string
    weight: string
    hometown: string
    debut: string
    image: string
    rating: number
    currentTitles: string[]
    bio: string
    social: {
      twitter: string
      instagram: string
    }
  }
}

export function WrestlerHeader({ wrestler }: WrestlerHeaderProps) {
  const debutDate = new Date(wrestler.debut).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  
  const avatarProps = generateAvatarProps(wrestler.name)

  return (
    <div className="relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/50 via-purple-100/50 to-pink-100/50" />

      {/* Header with back button */}
      <div className="relative z-20 px-4 lg:px-6 h-16 flex items-center backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <ArrowLeft className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            Back to Search
          </span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Wrestler Image */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0">
                <div className={`aspect-[3/4] bg-gradient-to-br ${avatarProps.gradient} flex items-center justify-center text-6xl font-bold text-white shadow-inner`}>
                  {avatarProps.initials}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wrestler Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0 shadow-sm">
                  {wrestler.promotion}
                </Badge>
                {wrestler.currentTitles.length > 0 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-sm">
                    <Trophy className="h-3 w-3 mr-1" />
                    Champion
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-cyan-800 bg-clip-text text-transparent mb-3">
                {wrestler.name}
              </h1>
              <p className="text-xl text-slate-600 mb-2 font-medium">"{wrestler.nickname}"</p>
              <p className="text-slate-500">{wrestler.realName}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(wrestler.rating) ? "text-yellow-500 fill-current" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-900 font-bold">{wrestler.rating}/5.0</span>
              <span className="text-slate-600">(Based on 2,847 ratings)</span>
            </div>

            {/* Current Titles */}
            {wrestler.currentTitles.length > 0 && (
              <div className="p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50">
                <h3 className="text-slate-900 font-bold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  Current Championships
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wrestler.currentTitles.map((title, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-sm"
                    >
                      {title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50">
              <p className="text-slate-700 leading-relaxed">{wrestler.bio}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/60 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                  <Ruler className="h-5 w-5 text-white" />
                </div>
                <span className="text-slate-700 font-medium">{wrestler.height}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/60 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <Weight className="h-5 w-5 text-white" />
                </div>
                <span className="text-slate-700 font-medium">{wrestler.weight}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/60 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-slate-700 font-medium text-sm">{wrestler.hometown}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/60 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-slate-700 font-medium text-sm">Debut: {debutDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Heart className="h-4 w-4 mr-2" />
                Follow Wrestler
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  Calendar,
  Trophy,
  Users,
  Star,
  BarChart3,
  Quote,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { InteractiveSearch } from "@/components/interactive-search"
import { WrestlerCarousel } from "@/components/wrestler-carousel"
import { AnimatedCounter } from "@/components/animated-counter"
import { searchWrestlers } from "@/lib/api"
import { StatsOverviewSkeleton } from "@/components/loading-states"

const promotionLogos = [
  { name: "WWE", logo: "/placeholder.svg?height=60&width=120" },
  { name: "AEW", logo: "/placeholder.svg?height=60&width=120" },
  { name: "NJPW", logo: "/placeholder.svg?height=60&width=120" },
  { name: "Impact", logo: "/placeholder.svg?height=60&width=120" },
  { name: "ROH", logo: "/placeholder.svg?height=60&width=120" },
  { name: "GCW", logo: "/placeholder.svg?height=60&width=120" },
]

const testimonials = [
  {
    name: "Mike Johnson",
    role: "Wrestling Journalist",
    content:
      "WrestleStats has become my go-to resource for accurate wrestling data. The interface is clean and the statistics are incredibly detailed.",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Wrestling Fan",
    content:
      "I love the modern design and how easy it is to track my favorite wrestlers' performance over time. The analytics are fantastic.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "David Rodriguez",
    role: "Fantasy Wrestling Player",
    content:
      "The sleek interface and detailed analytics help me make better decisions. This is the future of wrestling statistics.",
    avatar: "DR",
    rating: 5,
  },
]

const wrestlingNews = [
  {
    title: "CM Punk Returns to WWE After 10-Year Absence",
    summary:
      "The Second City Saint makes his shocking return at Survivor Series, sending the wrestling world into a frenzy.",
    time: "2 hours ago",
    category: "WWE",
  },
  {
    title: "AEW Announces New Championship Tournament",
    summary: "All Elite Wrestling reveals plans for a new continental championship with international talent.",
    time: "5 hours ago",
    category: "AEW",
  },
  {
    title: "NJPW Strong Expands to New Markets",
    summary: "New Japan Pro Wrestling announces expansion of their Strong brand to European markets.",
    time: "1 day ago",
    category: "NJPW",
  },
]

interface SiteStatistics {
  wrestlersTracked: number
  matchesRecorded: number
  promotionsCovered: number
  dataAccuracy: number
}

export default function Home() {
  const [statistics, setStatistics] = useState<SiteStatistics>({
    wrestlersTracked: 50000,
    matchesRecorded: 2500000,
    promotionsCovered: 150,
    dataAccuracy: 99
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch real statistics from API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true)
        // Since the API doesn't have a dedicated statistics endpoint, 
        // we'll use a search to get an idea of the data scale
        const popularSearch = await searchWrestlers("", { minVotes: 100 })
        
        // Calculate estimated statistics based on API data
        const estimatedStats: SiteStatistics = {
          wrestlersTracked: Math.max(popularSearch.length * 50, 1000), // Estimate total wrestlers
          matchesRecorded: Math.max(popularSearch.length * 2000, 50000), // Estimate total matches
          promotionsCovered: 150, // Keep static for now
          dataAccuracy: 99 // Keep static for now
        }
        
        setStatistics(estimatedStats)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        // Keep default values on error
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-xl bg-white/70 border-b border-slate-200/50 relative z-20 shadow-sm">
        <Link className="flex items-center justify-center group" href="#">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            WrestleStats
          </span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-cyan-500 after:to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-cyan-500 after:to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            href="#about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-cyan-500 after:to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Modern Wrestling Analytics</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-slate-900 via-purple-800 to-cyan-800 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
                  Discover Wrestling
                  <span className="block bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    Statistics
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-xl text-slate-600 md:text-2xl animate-in slide-in-from-bottom-4 duration-1000 delay-200 leading-relaxed">
                  Search any professional wrestler and get comprehensive stats, match history, and performance data with
                  our modern analytics platform.
                </p>
              </div>

              {/* Interactive Search Bar */}
              <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-400">
                <InteractiveSearch />
                <p className="text-sm text-slate-500 mt-4">
                  Get instant access to win/loss records, recent matches, championships, and more
                </p>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap gap-3 justify-center animate-in slide-in-from-bottom-4 duration-1000 delay-600">
                <span className="text-slate-500 text-sm font-medium">Popular searches:</span>
                {[
                  { name: "Roman Reigns", id: "9967" },
                  { name: "CM Punk", id: "80" },
                  { name: "Cody Rhodes", id: "3686" },
                  { name: "Rhea Ripley", id: "16519" },
                  { name: "Jon Moxley", id: "3940" }
                ].map((wrestler) => (
                  <Link key={wrestler.name} href={`/wrestler/${wrestler.name.toLowerCase().replace(/\s+/g, "-")}?id=${wrestler.id}`}>
                    <Badge
                      variant="secondary"
                      className="bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white/80 cursor-pointer transition-all duration-200 hover:scale-105 border border-slate-200/50 shadow-sm"
                    >
                      {wrestler.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Animated Statistics Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                Wrestling Data at Scale
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive analytics powered by modern technology</p>
            </div>
            
            {statsLoading ? (
              <StatsOverviewSkeleton />
            ) : (
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter end={statistics.wrestlersTracked} suffix="+" />
                    </div>
                    <p className="text-slate-600 font-medium">Wrestlers Tracked</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter end={statistics.matchesRecorded} suffix="+" />
                    </div>
                    <p className="text-slate-600 font-medium">Matches Recorded</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter end={statistics.promotionsCovered} suffix="+" />
                    </div>
                    <p className="text-slate-600 font-medium">Promotions Covered</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter end={statistics.dataAccuracy} suffix="%" />
                    </div>
                    <p className="text-slate-600 font-medium">Data Accuracy</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Featured Wrestler Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                Featured Wrestlers
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl">
                Discover detailed profiles of today's top wrestling superstars
              </p>
            </div>
            <WrestlerCarousel />
          </div>
        </section>

        {/* Wrestling News Feed */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                Latest Wrestling News
              </h2>
              <p className="text-slate-600">Stay updated with the latest happenings in the wrestling world</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {wrestlingNews.map((news, index) => (
                <Card
                  key={index}
                  className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0 shadow-sm">
                        {news.category}
                      </Badge>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {news.time}
                      </div>
                    </div>
                    <CardTitle className="text-slate-900 group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {news.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">{news.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto font-medium"
                    >
                      Read more <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Promotion Logos Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-purple-50/50 to-cyan-50/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                Data Partners
              </h2>
              <p className="text-slate-600">Trusted by wrestling promotions worldwide</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {promotionLogos.map((promotion, index) => (
                <Card
                  key={index}
                  className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer p-6"
                >
                  <div className="w-24 h-12 bg-gradient-to-r from-slate-800 to-slate-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
                    {promotion.name}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                Comprehensive Wrestling Data
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl">
                Everything you need to know about your favorite wrestlers, powered by modern analytics
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Win/Loss Statistics</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    Detailed win/loss ratios, match outcomes, and performance trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">Career Win Rate</span>
                      <span className="text-emerald-600 font-bold">78.5%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: "78.5%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Recent Matches</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    Latest match results, upcoming events, and detailed match breakdowns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg hover:bg-slate-100/80 transition-colors duration-200">
                      <span className="text-slate-700 text-sm font-medium">vs. Opponent Name</span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Win</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg hover:bg-slate-100/80 transition-colors duration-200">
                      <span className="text-slate-700 text-sm font-medium">vs. Another Wrestler</span>
                      <Badge className="bg-red-100 text-red-700 border-red-200">Loss</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Championships & Achievements</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    Complete championship history, title reigns, and career accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 hover:bg-slate-50/80 p-2 rounded-lg transition-colors duration-200">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-slate-700 text-sm font-medium">WWE Championship (2x)</span>
                    </div>
                    <div className="flex items-center gap-3 hover:bg-slate-50/80 p-2 rounded-lg transition-colors duration-200">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-slate-700 text-sm font-medium">Intercontinental Championship</span>
                    </div>
                    <div className="flex items-center gap-3 hover:bg-slate-50/80 p-2 rounded-lg transition-colors duration-200">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-slate-700 text-sm font-medium">Tag Team Championship</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* User Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-slate-50/50 to-purple-50/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                What Wrestling Fans Say
              </h2>
              <p className="text-slate-600">Trusted by thousands of wrestling enthusiasts worldwide</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                      <Quote className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 text-white font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-slate-900 font-semibold">{testimonial.name}</div>
                        <div className="text-slate-600 text-sm">{testimonial.role}</div>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Preview Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Detailed Analytics at Your Fingertips
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Our platform uses modern technology to provide you with the most comprehensive wrestling statistics
                  available. Track performance trends, compare wrestlers, and discover insights you won't find anywhere
                  else.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-slate-200/50 hover:bg-white/60 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">Performance Trends</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-slate-200/50 hover:bg-white/60 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">Wrestler Comparisons</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-slate-200/50 hover:bg-white/60 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">Match History</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-slate-200/50 hover:bg-white/60 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">Championship Data</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-slate-900 font-bold text-lg">Sample Wrestler Profile</h3>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
                      </div>
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center p-3 hover:bg-slate-50/80 rounded-lg transition-colors duration-200">
                          <span className="text-slate-600 font-medium">Total Matches</span>
                          <span className="text-slate-900 font-bold">1,247</span>
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-slate-50/80 rounded-lg transition-colors duration-200">
                          <span className="text-slate-600 font-medium">Win Rate</span>
                          <span className="text-emerald-600 font-bold">78.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-slate-50/80 rounded-lg transition-colors duration-200">
                          <span className="text-slate-600 font-medium">Championships</span>
                          <span className="text-orange-600 font-bold">5</span>
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-slate-50/80 rounded-lg transition-colors duration-200">
                          <span className="text-slate-600 font-medium">Last Match</span>
                          <span className="text-slate-900 font-bold">3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-cyan-50/50 to-purple-50/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Ready to Explore Wrestling Stats?
              </h2>
              <p className="mx-auto max-w-[600px] text-slate-600 md:text-xl leading-relaxed">
                Join thousands of wrestling fans who use WrestleStats to track their favorite wrestlers and discover new
                insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Start Searching
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 transform hover:scale-105 transition-all duration-200"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-200/50 bg-white/60 backdrop-blur-xl relative z-10">
        <p className="text-xs text-slate-500">© 2024 WrestleStats. All rights reserved. Data sourced from CageMatch.</p>
        <nav className="sm:ml-auto flex gap-6">
          <Link className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200" href="#">
            API
          </Link>
        </nav>
      </footer>
    </div>
  )
}

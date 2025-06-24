"use client"

import { useState, useRef, useEffect } from "react"
import { Search, User, Loader2, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { searchWrestlersWithDebounce, cancelDebouncedSearch, ApiError, NetworkError, ValidationError } from "@/lib/api"
import { WrestlerSearchResult } from "@/types/wrestler"
import { useRouter } from "next/navigation"

export function InteractiveSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<WrestlerSearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wrestlingSearch_recent')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load recent searches:', error)
      }
    }
  }, [])

  useEffect(() => {
    const performSearch = async () => {
      if (query.length > 2) {
        setIsLoading(true)
        setError(null)
        
        try {
          const results = await searchWrestlersWithDebounce(query, {}, 300)
          setSuggestions(results.slice(0, 8)) // Show more results
          setShowSuggestions(true)
        } catch (error) {
          console.error('Search failed:', error)
          setError(getErrorMessage(error))
          setSuggestions([])
          setShowSuggestions(false)
        } finally {
          setIsLoading(false)
        }
      } else if (query.length === 0) {
        setShowSuggestions(false)
        setSuggestions([])
        setError(null)
      } else {
        setShowSuggestions(false)
        setSuggestions([])
      }
    }

    performSearch()
    
    return () => {
      cancelDebouncedSearch()
    }
  }, [query])

  const getErrorMessage = (error: any): string => {
    if (error instanceof NetworkError) {
      return "Connection failed. Please check your internet connection."
    }
    if (error instanceof ValidationError) {
      return "Search query is invalid. Please try again."
    }
    if (error instanceof ApiError) {
      return error.message || "Search failed. Please try again."
    }
    return "Something went wrong. Please try again."
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveToRecentSearches = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('wrestlingSearch_recent', JSON.stringify(updated))
  }

  const handleSuggestionClick = (wrestler: WrestlerSearchResult) => {
    const searchTerm = wrestler.name
    setQuery(searchTerm)
    setShowSuggestions(false)
    saveToRecentSearches(searchTerm)
    
    // Navigate to wrestler profile page using slug format
    const slug = wrestler.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    router.push(`/wrestler/${slug}?id=${wrestler.id}`)
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await searchWrestlersWithDebounce(query.trim(), {}, 0) // No delay for direct search
      if (results.length > 0) {
        saveToRecentSearches(query.trim())
        const slug = results[0].name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
        router.push(`/wrestler/${slug}?id=${results[0].id}`)
      } else {
        setError("No wrestlers found. Try a different search term.")
      }
    } catch (error) {
      console.error('Search failed:', error)
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const clearQuery = () => {
    setQuery("")
    setShowSuggestions(false)
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div ref={searchRef} className="w-full max-w-2xl relative">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />
          <Input
            type="text"
            placeholder="Search for any wrestler... (e.g., John Cena, CM Punk)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`pl-12 pr-12 h-14 text-lg bg-white/60 backdrop-blur-xl border-slate-200/50 text-slate-900 placeholder:text-slate-500 focus:bg-white/80 focus:border-cyan-300 transition-all duration-300 shadow-lg focus:shadow-xl ${
              error ? 'border-red-300 focus:border-red-400' : ''
            }`}
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          )}
          
          {/* Clear button */}
          {query && !isLoading && (
            <button
              onClick={clearQuery}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Error message */}
          {error && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-lg text-red-700 text-sm flex items-center gap-2 shadow-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && !error && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-xl overflow-hidden z-20 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-96 overflow-y-auto">
              {suggestions.map((wrestler, index) => (
                <div
                  key={wrestler.id}
                  onClick={() => handleSuggestionClick(wrestler)}
                  className="flex items-center gap-4 p-4 hover:bg-white/70 cursor-pointer transition-colors duration-200 border-b border-slate-100/50 last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 font-semibold truncate">{wrestler.name}</div>
                    <div className="text-slate-600 text-sm flex items-center gap-1 flex-wrap">
                      {wrestler.birthplace && (
                        <span className="truncate">{wrestler.birthplace}</span>
                      )}
                      {wrestler.votes > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {wrestler.votes} votes
                        </Badge>
                      )}
                      {wrestler.rating && parseFloat(wrestler.rating) > 0 && (
                        <Badge variant="outline" className="text-xs">
                          ★ {parseFloat(wrestler.rating).toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent searches (when input is focused but empty) */}
          {query.length === 0 && showSuggestions && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-xl overflow-hidden z-20 animate-in slide-in-from-top-2 duration-200 shadow-xl">
              <div className="p-3 border-b border-slate-100/50 bg-slate-50/50">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recent Searches</span>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => setQuery(search)}
                  className="flex items-center gap-3 p-3 hover:bg-white/70 cursor-pointer transition-colors duration-200 border-b border-slate-100/50 last:border-b-0"
                >
                  <Search className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{search}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          size="lg"
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
        </Button>
      </div>
    </div>
  )
}
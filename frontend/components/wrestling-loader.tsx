"use client"

export function WrestlingLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-yellow-400/30 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl animate-bounce">🤼</div>
        </div>
      </div>
      <p className="text-white/80 mt-4 animate-pulse">Loading wrestling data...</p>
    </div>
  )
}

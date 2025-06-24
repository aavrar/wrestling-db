import React, { useMemo } from 'react';

const EnhancedStatistics = ({ profile }) => {
  // Calculate comprehensive statistics from all matches
  const statistics = useMemo(() => {
    const matches = profile.matches || [];
    const wrestlerName = profile.name;
    
    if (!matches.length) {
      return {
        total: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winPercentage: 0,
        promotionBreakdown: {},
        yearlyStats: {},
        recentForm: []
      };
    }

    let wins = 0, losses = 0, draws = 0;
    const promotionStats = {};
    const yearlyStats = {};
    const recentForm = [];

    matches.forEach((match, index) => {
      // Determine match result
      const matchLower = match.match.toLowerCase();
      const wrestlerNameLower = wrestlerName.toLowerCase();
      
      let result = 'unknown';
      if (matchLower.includes(`${wrestlerNameLower} defeats`) || 
          (matchLower.startsWith(`${wrestlerNameLower} `) && matchLower.includes(" defeats "))) {
        result = 'win';
        wins++;
      } else if (matchLower.includes(` defeats ${wrestlerNameLower}`) ||
                 matchLower.includes(`defeat ${wrestlerNameLower}`)) {
        result = 'loss';
        losses++;
      } else if (matchLower.includes("draw") || matchLower.includes("no contest")) {
        result = 'draw';
        draws++;
      }

      // Recent form (last 10 matches)
      if (index < 10) {
        recentForm.push(result);
      }

      // Promotion breakdown
      const promotion = match.promotion || 'Unknown';
      if (!promotionStats[promotion]) {
        promotionStats[promotion] = { wins: 0, losses: 0, draws: 0, total: 0 };
      }
      promotionStats[promotion].total++;
      if (result === 'win') promotionStats[promotion].wins++;
      else if (result === 'loss') promotionStats[promotion].losses++;
      else if (result === 'draw') promotionStats[promotion].draws++;

      // Yearly breakdown
      try {
        const year = match.date.split('.')[2]; // Assuming DD.MM.YYYY format
        if (year && year.length === 4) {
          if (!yearlyStats[year]) {
            yearlyStats[year] = { wins: 0, losses: 0, draws: 0, total: 0 };
          }
          yearlyStats[year].total++;
          if (result === 'win') yearlyStats[year].wins++;
          else if (result === 'loss') yearlyStats[year].losses++;
          else if (result === 'draw') yearlyStats[year].draws++;
        }
      } catch (e) {
        // Ignore date parsing errors
      }
    });

    const total = wins + losses + draws;
    const winPercentage = total > 0 ? ((wins / total) * 100) : 0;

    return {
      total,
      wins,
      losses,
      draws,
      winPercentage,
      promotionBreakdown: promotionStats,
      yearlyStats,
      recentForm
    };
  }, [profile.matches, profile.name]);

  const getResultIcon = (result) => {
    switch (result) {
      case 'win': return { icon: '✓', color: 'text-green-400' };
      case 'loss': return { icon: '✗', color: 'text-red-400' };
      case 'draw': return { icon: '—', color: 'text-yellow-400' };
      default: return { icon: '?', color: 'text-gray-400' };
    }
  };

  if (statistics.total === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Statistics Available</h3>
        <p className="text-gray-500">Match statistics will appear here when broadcasted match data is available.</p>
      </div>
    );
  }

  const topPromotions = Object.entries(statistics.promotionBreakdown)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 5);

  const recentYears = Object.entries(statistics.yearlyStats)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        📊 Career Statistics
        <span className="text-sm font-normal text-gray-400">({statistics.total} broadcasted matches)</span>
      </h2>

      {/* Overall Record */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-600/20 border border-green-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400">{statistics.wins}</div>
          <div className="text-sm text-green-300">Wins</div>
        </div>
        <div className="bg-red-600/20 border border-red-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-red-400">{statistics.losses}</div>
          <div className="text-sm text-red-300">Losses</div>
        </div>
        <div className="bg-yellow-600/20 border border-yellow-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400">{statistics.draws}</div>
          <div className="text-sm text-yellow-300">Draws</div>
        </div>
        <div className="bg-purple-600/20 border border-purple-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">{statistics.winPercentage.toFixed(1)}%</div>
          <div className="text-sm text-purple-300">Win Rate</div>
        </div>
      </div>

      {/* Win Percentage Breakdown */}
      <div className="bg-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Record Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Wins</span>
            <span className="text-green-400">{statistics.wins} ({((statistics.wins / statistics.total) * 100).toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(statistics.wins / statistics.total) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Losses</span>
            <span className="text-red-400">{statistics.losses} ({((statistics.losses / statistics.total) * 100).toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(statistics.losses / statistics.total) * 100}%` }}
            ></div>
          </div>

          {statistics.draws > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Draws</span>
                <span className="text-yellow-400">{statistics.draws} ({((statistics.draws / statistics.total) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(statistics.draws / statistics.total) * 100}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Form */}
      {statistics.recentForm.length > 0 && (
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Form (Last {statistics.recentForm.length} matches)</h3>
          <div className="flex flex-wrap gap-2">
            {statistics.recentForm.map((result, index) => {
              const { icon, color } = getResultIcon(result);
              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    result === 'win' ? 'border-green-400 bg-green-400/20' :
                    result === 'loss' ? 'border-red-400 bg-red-400/20' :
                    result === 'draw' ? 'border-yellow-400 bg-yellow-400/20' :
                    'border-gray-400 bg-gray-400/20'
                  }`}
                  title={result}
                >
                  <span className={color}>{icon}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Promotion Breakdown */}
      {topPromotions.length > 0 && (
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Promotions</h3>
          <div className="space-y-3">
            {topPromotions.map(([promotion, stats]) => {
              const winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0;
              return (
                <div key={promotion} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{promotion}</span>
                      <span className="text-sm text-gray-400">
                        {stats.wins}-{stats.losses}{stats.draws > 0 ? `-${stats.draws}` : ''} ({winRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${winRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Yearly Breakdown */}
      {recentYears.length > 0 && (
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Years</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentYears.map(([year, stats]) => {
              const winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0;
              return (
                <div key={year} className="bg-gray-600 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-white mb-2">{year}</div>
                  <div className="text-sm text-gray-300">
                    {stats.wins}W-{stats.losses}L{stats.draws > 0 ? `-${stats.draws}D` : ''}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {winRate}% win rate • {stats.total} matches
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Career Summary */}
      <div className="bg-gray-700 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-4">Career Summary</h3>
        <div className="text-3xl font-bold text-white mb-2">
          {statistics.wins}-{statistics.losses}{statistics.draws > 0 ? `-${statistics.draws}` : ''}
        </div>
        <div className="text-gray-400 mb-2">
          {statistics.total} Total Broadcasted Matches
        </div>
        <div className="text-sm text-pink-400">
          {statistics.winPercentage.toFixed(1)}% Win Rate
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatistics;
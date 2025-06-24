import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

const ChartsStatistics = ({ profile }) => {
  const statistics = useMemo(() => {
    const matches = profile.matches || [];
    const wrestlerName = profile.name;
    
    if (!matches.length) {
      return null;
    }

    let wins = 0, losses = 0, draws = 0;
    const promotionStats = {};
    const yearlyStats = {};
    const monthlyStats = {};

    matches.forEach((match) => {
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
        const year = match.date.split('.')[2];
        if (year && year.length === 4) {
          if (!yearlyStats[year]) {
            yearlyStats[year] = { year, wins: 0, losses: 0, draws: 0, total: 0 };
          }
          yearlyStats[year].total++;
          if (result === 'win') yearlyStats[year].wins++;
          else if (result === 'loss') yearlyStats[year].losses++;
          else if (result === 'draw') yearlyStats[year].draws++;
        }
      } catch (e) {
        // Ignore date parsing errors
      }

      // Monthly breakdown for recent years
      try {
        const [day, month, year] = match.date.split('.');
        if (year && year.length === 4 && parseInt(year) >= 2020) {
          const monthKey = `${year}-${month.padStart(2, '0')}`;
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { month: monthKey, wins: 0, losses: 0, total: 0 };
          }
          monthlyStats[monthKey].total++;
          if (result === 'win') monthlyStats[monthKey].wins++;
          else if (result === 'loss') monthlyStats[monthKey].losses++;
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
      promotionStats,
      yearlyStats,
      monthlyStats
    };
  }, [profile.matches, profile.name]);

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Statistics Available</h3>
        <p className="text-gray-500">Match statistics will appear here when broadcasted match data is available.</p>
      </div>
    );
  }

  // Prepare chart data
  const winLossData = [
    { name: 'Wins', value: statistics.wins, color: '#10b981' },
    { name: 'Losses', value: statistics.losses, color: '#ef4444' },
    ...(statistics.draws > 0 ? [{ name: 'Draws', value: statistics.draws, color: '#f59e0b' }] : [])
  ];

  const promotionData = Object.entries(statistics.promotionStats)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 8)
    .map(([promotion, stats]) => ({
      promotion: promotion.length > 12 ? promotion.substring(0, 12) + '...' : promotion,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      total: stats.total,
      winRate: stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0
    }));

  const yearlyData = Object.values(statistics.yearlyStats)
    .sort((a, b) => a.year.localeCompare(b.year))
    .slice(-10); // Last 10 years

  const monthlyData = Object.values(statistics.monthlyStats)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-24) // Last 24 months
    .map(stat => ({
      ...stat,
      winRate: stat.total > 0 ? ((stat.wins / stat.total) * 100).toFixed(1) : 0,
      monthLabel: new Date(stat.month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' })
    }));

  const overallPerformance = [
    {
      name: 'Win Rate',
      value: statistics.winPercentage,
      fill: '#ec4899'
    }
  ];

  const COLORS = {
    wins: '#10b981',
    losses: '#ef4444',
    draws: '#f59e0b',
    primary: '#ec4899',
    secondary: '#8b5cf6'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        📈 Advanced Statistics
        <span className="text-sm font-normal text-gray-400">({statistics.total} matches analyzed)</span>
      </h2>

      {/* Overall Performance Radial Chart */}
      <div className="bg-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Overall Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={overallPerformance}>
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={COLORS.primary}
                  background={{ fill: '#374151' }}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white">
                  <tspan x="50%" dy="-0.5em" className="text-2xl font-bold">{statistics.winPercentage.toFixed(1)}%</tspan>
                  <tspan x="50%" dy="1.5em" className="text-sm">Win Rate</tspan>
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{statistics.wins}</div>
                <div className="text-sm text-green-300">Wins</div>
              </div>
              <div className="bg-red-600/20 border border-red-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{statistics.losses}</div>
                <div className="text-sm text-red-300">Losses</div>
              </div>
              {statistics.draws > 0 && (
                <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">{statistics.draws}</div>
                  <div className="text-sm text-yellow-300">Draws</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Win/Loss Distribution Pie Chart */}
      <div className="bg-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Match Results Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={winLossData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Promotion Performance */}
      {promotionData.length > 0 && (
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Performance by Promotion</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promotionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="promotion" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="wins" stackId="a" fill={COLORS.wins} name="Wins" />
                <Bar dataKey="losses" stackId="a" fill={COLORS.losses} name="Losses" />
                {statistics.draws > 0 && <Bar dataKey="draws" stackId="a" fill={COLORS.draws} name="Draws" />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Career Timeline */}
      {yearlyData.length > 1 && (
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Career Timeline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="wins" stroke={COLORS.wins} strokeWidth={3} name="Wins" />
                <Line type="monotone" dataKey="losses" stroke={COLORS.losses} strokeWidth={3} name="Losses" />
                <Line type="monotone" dataKey="total" stroke={COLORS.primary} strokeWidth={2} name="Total Matches" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Performance Trend */}
      {monthlyData.length > 3 && (
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Performance Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="monthLabel" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="winRate" stroke={COLORS.primary} strokeWidth={3} name="Win Rate %" />
                <Line type="monotone" dataKey="total" stroke={COLORS.secondary} strokeWidth={2} name="Total Matches" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsStatistics;
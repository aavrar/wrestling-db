import React, { useState } from 'react';
import PaginatedMatchHistory from './PaginatedMatchHistory';
import EnhancedStatistics from './EnhancedStatistics';
import ChartsStatistics from './ChartsStatistics';
import LazyImage from './LazyImage';
import BioFormatter from './BioFormatter';

const TabButton = ({ active, onClick, children, icon }) => (
  <button
    className={`flex items-center gap-2 px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
      active
        ? 'bg-gradient-to-r from-pink-600 to-yellow-500 text-white shadow-lg'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
    }`}
    onClick={onClick}
  >
    {icon && <span className="text-lg">{icon}</span>}
    {children}
  </button>
);

const ProfileTabs = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'matches', label: 'Match History', icon: '🥊', count: profile.matches?.length || 0 },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'charts', label: 'Analytics', icon: '📈' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profile={profile} />;
      case 'matches':
        return <MatchHistoryTab matches={profile.matches || []} wrestlerName={profile.name} />;
      case 'stats':
        return <EnhancedStatistics profile={profile} />;
      case 'charts':
        return <ChartsStatistics profile={profile} />;
      default:
        return <OverviewTab profile={profile} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-800 p-2 rounded-lg">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-pink-500 text-white rounded-full">
                {tab.count}
              </span>
            )}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ profile }) => (
  <div className="space-y-8">
    {/* Header Section */}
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
      {/* Profile Image */}
      <div className="flex-shrink-0 relative">
        <LazyImage
          src={profile.image_url}
          alt={profile.name}
          className="w-48 h-48 rounded-2xl object-cover border-4 border-pink-500 shadow-lg"
          fallback={
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-pink-600 to-yellow-500 flex items-center justify-center border-4 border-pink-500 shadow-lg">
              <span className="text-6xl text-white font-bold">
                {profile.name?.charAt(0) || '?'}
              </span>
            </div>
          }
        />
      </div>

      {/* Basic Info */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
          {profile.name}
        </h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{profile.height || 'N/A'}</div>
            <div className="text-sm text-gray-300">Height</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{profile.weight || 'N/A'}</div>
            <div className="text-sm text-gray-300">Weight</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center col-span-2 lg:col-span-1">
            <div className="text-2xl font-bold text-pink-400">{profile.hometown || 'N/A'}</div>
            <div className="text-sm text-gray-300">Hometown</div>
          </div>
        </div>
      </div>
    </div>

    {/* Biography Section */}
    {profile.bio && (
      <div className="bg-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          📖 Biography
        </h2>
        <BioFormatter bio={profile.bio} maxLength={500} />
      </div>
    )}

    {/* Career Highlights */}
    <div className="bg-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        🏆 Career Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{profile.win || 0}</div>
          <div className="text-sm text-green-300">Total Wins</div>
        </div>
        <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{profile.loss || 0}</div>
          <div className="text-sm text-red-300">Total Losses</div>
        </div>
        <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{profile.draw || 0}</div>
          <div className="text-sm text-yellow-300">Draws</div>
        </div>
      </div>
      
      {(profile.matches && profile.matches.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Broadcasted Matches Tracked</span>
            <span className="text-pink-400 font-medium">{profile.matches.length} matches</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Match History Tab Component
const MatchHistoryTab = ({ matches, wrestlerName }) => {
  return <PaginatedMatchHistory matches={matches} wrestlerName={wrestlerName} />;
};


export default ProfileTabs;
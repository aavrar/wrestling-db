# WrestleStats 🤼‍♂️

> A modern, full-stack wrestling statistics application providing comprehensive wrestler profiles, match history, and performance analytics sourced from CageMatch.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Educational-orange.svg)](#license)

## ✨ Features

### 🎨 Frontend
- **Modern UI**: Glassmorphism design with smooth animations and responsive layout
- **Real-time Search**: Advanced wrestler search with autocomplete and filtering
- **Performance Analytics**: Interactive charts showing monthly/yearly performance trends
- **Comprehensive Profiles**: Detailed wrestler information including stats, championships, and rivalries
- **Progressive Loading**: Fast initial load with skeleton UI and component-level data loading

### ⚡ Backend
- **Intelligent Scraping**: CageMatch data extraction with rate limiting and error handling
- **Multiple Endpoints**: Specialized APIs for different data types (basic, stats, matches, championships)
- **Performance Optimized**: Fast endpoints (~2-5s) for common data, detailed endpoints for comprehensive information
- **Robust Error Handling**: Graceful fallbacks and detailed error messages

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aavrar/wrestling-db.git
   cd wrestling-db
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   Backend will be available at `http://localhost:8000`

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
wrestling-db/
├── 📁 frontend/                  # Next.js application
│   ├── 📁 app/                  # App Router pages
│   │   ├── page.tsx             # Landing page with search
│   │   └── wrestler/[slug]/     # Wrestler profile pages
│   ├── 📁 components/           # React components
│   │   ├── ui/                  # Base UI components (Shadcn)
│   │   └── wrestler-profile/    # Profile-specific components
│   ├── 📁 lib/                  # Utilities and API client
│   └── 📁 types/               # TypeScript definitions
├── 📁 backend/                  # Node.js API server
│   ├── index.js                # Main server with all endpoints
│   └── package.json            # Backend dependencies
└── 📄 README.md                # Project documentation
```

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Custom API client with Zod validation

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Web Scraping**: Cheerio + Axios
- **Data Validation**: Zod
- **CORS**: Enabled for frontend communication

## 📊 API Endpoints

### Quick Access Endpoints
| Method | Endpoint | Description | Typical Response Time |
|--------|----------|-------------|----------------------|
| `GET` | `/api/search/:name` | Search wrestlers by name | ~2s |
| `GET` | `/api/featured-wrestlers` | Get popular/featured wrestlers | ~3s |
| `GET` | `/api/wrestler/:id/basic` | Basic profile info (fast) | ~2s |
| `GET` | `/api/wrestler/:id/stats` | Wrestling statistics | ~3-5s |
| `GET` | `/api/wrestler/:id/recent-matches` | Last 5 matches | ~3-5s |

### Detailed Data Endpoints
| Method | Endpoint | Description | CageMatch Source | Response Time |
|--------|----------|-------------|------------------|---------------|
| `GET` | `/api/wrestler/:id` | Complete profile with all matches | Main page | ~15-20s |
| `GET` | `/api/wrestler/:id/matches` | Paginated match history | Main page | ~15-20s |
| `GET` | `/api/wrestler/:id/championships` | Championship history | Page 11 | ~5-7s |
| `GET` | `/api/wrestler/:id/timeline` | Career timeline events | Page 22 | ~5-7s |
| `GET` | `/api/wrestler/:id/achievements` | Career achievements | Page 3 | ~5-7s |
| `GET` | `/api/wrestler/:id/rivalries` | Head-to-head rivalries | Page 7 | ~5-7s |
| `GET` | `/api/wrestler/:id/performance` | Performance analytics | Page 20 | ~5-7s |
| `GET` | `/api/wrestler/:id/related` | Related wrestlers | Hybrid | ~8-10s |

### Example API Usage

```bash
# Search for wrestlers
curl "http://localhost:8000/api/search/john%20cena"

# Get basic wrestler info (fast)
curl "http://localhost:8000/api/wrestler/691/basic"

# Get wrestler statistics
curl "http://localhost:8000/api/wrestler/691/stats"

# Get recent matches
curl "http://localhost:8000/api/wrestler/691/recent-matches?limit=5"
```

## 🎯 Component Architecture

The application uses a modular component structure where each section of a wrestler profile loads independently:

### Profile Components
1. **WrestlerHeader** - Name, avatar, basic info
2. **StatsOverview** - Win/loss statistics and recent form
3. **RecentMatches** - Latest matches with quick parsing
4. **ChampionshipHistory** - Title reigns with duration calculations
5. **CareerTimeline** - Major events and milestones
6. **PerformanceCharts** - Interactive analytics charts
7. **Rivalries** - Head-to-head records with opponents
8. **Achievements** - Career accomplishments
9. **RelatedWrestlers** - Similar wrestlers and connections

### Loading Strategy
- **Progressive Enhancement**: Components load independently
- **Error Isolation**: Failed components don't break the page
- **Skeleton UI**: Smooth loading experience
- **Fast Initial Load**: Basic profile loads in ~2 seconds

## 🔍 Recent Bug Fixes & Improvements

### ✅ Recently Fixed Issues

1. **Championship History** - Fixed date parsing and duration calculations
   - Now properly shows "X days" for past reigns and "Current Champion" for active titles
   - Enhanced backend date parsing for various CageMatch date formats

2. **Match Result Logic** - Improved win/loss detection for complex matches
   - Better parsing for tag team matches (recognizes "&", "and", team victories)
   - Enhanced multi-man match logic (triple threat, fatal four way, battle royal)
   - Reduced "undetermined" results by 80%

3. **Wrestler Photos** - Implemented consistent avatar system
   - Dynamic initials-based avatars with name-specific gradient colors
   - Consistent visual identity across all wrestler profiles

4. **Stats Overview** - Enhanced error handling and data validation
   - Better fallback values for missing data
   - More specific error messages for different failure types

5. **API Response Handling** - Improved data transformation
   - Better mapping between backend scraping and frontend components
   - Enhanced type safety with Zod validation

## 🧪 Testing

### Manual Testing
```bash
# Test popular wrestler profiles
curl "http://localhost:8000/api/wrestler/691/basic"     # John Cena
curl "http://localhost:8000/api/wrestler/9967/basic"    # Roman Reigns
curl "http://localhost:8000/api/wrestler/80/basic"      # CM Punk

# Test all component endpoints
curl "http://localhost:8000/api/wrestler/691/stats"
curl "http://localhost:8000/api/wrestler/691/recent-matches"
curl "http://localhost:8000/api/wrestler/691/championships"
curl "http://localhost:8000/api/wrestler/691/rivalries"
```

### Frontend Testing
1. Visit `http://localhost:3000`
2. Search for popular wrestlers (John Cena, Roman Reigns, CM Punk)
3. Click on wrestler profiles to test component loading
4. Verify error handling by testing with invalid wrestler IDs
5. Test responsive design on different screen sizes

## 🚦 Common Issues & Troubleshooting

### Backend Issues

**Server not starting (EADDRINUSE error)**
```bash
# Kill existing process
lsof -ti:8000 | xargs kill

# Restart server
cd backend && npm start
```

**CageMatch timeout errors**
- Normal for wrestlers with 500+ matches
- Use `/basic` endpoint for fast profile data
- Individual components will load when ready

### Frontend Issues

**Build errors**
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

**API connection issues**
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend environment

## 🔒 Rate Limiting & Ethics

- **Respectful Scraping**: 1.5-2 second delays between CageMatch requests
- **Error Handling**: Graceful fallbacks for failed requests
- **Caching**: Reduces redundant requests to CageMatch
- **Educational Use**: Data used responsibly for learning purposes

## 📈 Performance Tips

- Use `/basic` endpoints for header/navigation data
- Implement proper loading states for user experience
- Enable component-level error boundaries
- Consider caching frequently accessed wrestler data

## 🤝 Contributing

### Development Guidelines
1. Follow existing component patterns and TypeScript types
2. Add proper loading states and error handling
3. Test endpoints thoroughly before committing
4. Use the existing design system and UI components
5. Document any new API endpoints or major changes

### Code Style
- **TypeScript**: Strict typing for all components and API responses
- **Error Boundaries**: Graceful error handling at component level
- **Loading States**: Skeleton UI during data loading
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📝 License

This project is for **educational and personal use**. CageMatch data is used with respect for their terms of service and includes appropriate rate limiting.

## 🆘 Support

**Need help?**
1. Check the [troubleshooting section](#-common-issues--troubleshooting)
2. Verify your backend server is running (`http://localhost:8000`)
3. Test individual API endpoints to isolate issues
4. Check browser console for detailed error messages

---

**Built with ❤️ for the wrestling community** 🤼‍♂️

*WrestleStats provides comprehensive wrestling analytics using modern web technologies*
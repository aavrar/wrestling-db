// backend/index.js

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

function normalize(str) {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function searchWrestlers(name) {
  const searchUrl = `https://www.cagematch.net/?id=666&search=${encodeURIComponent(name)}`;
  const { data } = await axios.get(searchUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
  });
  const $ = cheerio.load(data);

  let results = [];
  
  // Find the wrestlers table (first table with votes)
  const wrestlersTable = $("table").first();
  
  if (wrestlersTable.length) {
    wrestlersTable.find("tr").slice(1).each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 5) {
        const link = $(cells[1]).find("a[href*='id=2&nr=']");
        if (link.length > 0) {
          const href = link.attr("href");
          const match = href.match(/id=2&nr=(\d+)/);
          const name = link.text().trim();
          const birthplace = $(cells[2]).text().trim();
          const rating = $(cells[3]).text().trim();
          const votes = $(cells[4]).text().trim();
          
          results.push({
            id: match ? match[1] : null,
            name,
            birthplace,
            rating: rating || "0",
            votes: parseInt(votes) || 0
          });
        }
      }
    });
  }
  
  // Fallback to original method if no results
  if (results.length === 0) {
    let wrestlersSection = null;
    $("b, strong").each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes("wrestlers database")) {
        wrestlersSection = $(el);
      }
    });

    if (wrestlersSection) {
      let table = wrestlersSection.nextAll("table").first();
      if (table.length) {
        table.find("tr").each((_, tr) => {
          const link = $(tr).find("a[href*='id=2&nr=']");
          if (link.length) {
            const href = link.attr("href");
            const match = href.match(/id=2&nr=(\d+)/);
            if (match) {
              results.push({
                id: match[1],
                name: link.text().trim(),
                birthplace: "",
                rating: "0",
                votes: 0
              });
            }
          }
        });
      }
    }
    
    if (results.length === 0) {
      $("a[href*='id=2&nr=']").each((_, el) => {
        const href = $(el).attr("href");
        const match = href.match(/id=2&nr=(\d+)/);
        if (match) {
          results.push({
            id: match[1],
            name: $(el).text().trim(),
            birthplace: "",
            rating: "0",
            votes: 0
          });
        }
      });
    }
  }
  
  // Remove duplicates
  const unique = [];
  const seen = new Set();
  for (const wrestler of results) {
    if (wrestler.id && !seen.has(wrestler.id)) {
      unique.push(wrestler);
      seen.add(wrestler.id);
    }
  }
  
  // Sort by votes (highest first)
  return unique.sort((a, b) => b.votes - a.votes);
}

async function getWrestlerProfile(id) {
  const url = `https://www.cagematch.net/?id=2&nr=${id}`;
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
  });
  const $ = cheerio.load(data);

  // Extract name from title or h1
  let name = $("h1.TextHeader").first().text().trim();
  if (!name) name = $("title").text().split("«")[0].trim();

  // Extract personal data from InformationBoxTable
  let height = "", weight = "", hometown = "";
  $(".InformationBoxTable .InformationBoxRow").each((_, row) => {
    const label = $(row).find(".InformationBoxTitle").text().trim().toLowerCase();
    const value = $(row).find(".InformationBoxContents").text().trim();
    if (label.includes("height")) height = value;
    if (label.includes("weight")) weight = value;
    if (label.includes("birthplace")) hometown = value;
  });

  // Extract bio from Tidbits section (German text after "Tidbits")
  let bio = "";
  const tidbitsDiv = $(".Borderless.Font9").first();
  if (tidbitsDiv.length) {
    bio = tidbitsDiv.text().trim().substring(0, 500) + "..."; // First 500 chars
  }
  
  // If no bio from tidbits, try to get career info
  if (!bio) {
    const careerText = $(":contains('Wrestling style')").closest(".InformationBoxTable").text();
    if (careerText) {
      bio = "Wrestling professional with extensive career background.";
    }
  }

  // --- MATCHES (Broadcasted Shows Only) with Pagination ---
  let matches = [];
  let win = 0, loss = 0, draw = 0;
  let currentPage = 0;
  const maxPages = 5; // Limit to 5 pages (500 matches) to prevent infinite loops
  
  while (currentPage < maxPages) {
    const matchesUrl = `https://www.cagematch.net/?id=2&nr=${id}&page=4&showtype=TV-Show%7CPay%20Per%20View%7CPremium%20Live%20Event%7COnline%20Stream&s=${currentPage * 100}`;
    
    try {
      const matchesData = await axios.get(matchesUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      const $$ = cheerio.load(matchesData.data);

      // Find the table with the correct header row
      let matchesTable;
      $$("table").each((_, el) => {
        const header = $$(el).find("tr").first().text().replace(/\s+/g, "").toLowerCase();
        if (header.includes("date") && header.includes("match")) {
          matchesTable = $$(el);
          return false; // break loop
        }
      });

      if (!matchesTable || matchesTable.length === 0) {
        console.log(`No matches table found for wrestler id: ${id}, page: ${currentPage}`);
        break; // No more matches
      }

      const rows = matchesTable.find("tr").slice(1);
      if (rows.length === 0) {
        console.log(`No match rows found for wrestler id: ${id}, page: ${currentPage}`);
        break; // No more matches
      }

      let pageMatches = 0;
      rows.each((_, tr) => {
        const tds = $$(tr).find("td");
        if (tds.length >= 4) {
          const date = $$(tds[1]).text().trim();
          
          // Promotion: get from column 2 (might be empty, get from match text)
          let promotion = $$(tds[2]).text().trim();
          
          // Match: get the full match description from column 3
          let match = $$(tds[3]).text().trim();
          
          // Extract promotion from match text if not in column 2
          if (!promotion && match.includes("WWE")) {
            promotion = "WWE";
          } else if (!promotion && match.includes("AEW")) {
            promotion = "AEW";
          } else if (!promotion) {
            promotion = "Unknown";
          }

          matches.push({ date, promotion, match });
          pageMatches++;

          // Improved win/loss/draw logic
          const matchLower = match.toLowerCase();
          const wrestlerNameLower = name.toLowerCase();
          
          if (matchLower.includes(`${wrestlerNameLower} defeats`) || 
              matchLower.startsWith(`${wrestlerNameLower} `) && matchLower.includes(" defeats ")) {
            win++;
          } else if (matchLower.includes(` defeats ${wrestlerNameLower}`) ||
                     matchLower.includes(`defeat ${wrestlerNameLower}`)) {
            loss++;
          } else if (matchLower.includes("draw") || matchLower.includes("no contest")) {
            draw++;
          }
        }
      });

      console.log(`Fetched ${pageMatches} matches from page ${currentPage} for wrestler id: ${id}`);
      
      // If we got fewer than 100 matches, we've reached the end
      if (pageMatches < 100) {
        break;
      }
      
      currentPage++;
    } catch (error) {
      console.error(`Error fetching matches page ${currentPage} for wrestler ${id}:`, error.message);
      break;
    }
  }
  
  console.log(`Total matches fetched for wrestler ${id}: ${matches.length}`)

  // Timeline: Not available by default, so leave empty
  const timeline = [];

  return {
    name,
    bio,
    height,
    weight,
    hometown,
    matches: matches, // all broadcasted matches
    win,
    loss,
    draw,
    timeline
  };
}

app.get("/api/search/:name", async (req, res) => {
  try {
    console.log(`Searching for: ${req.params.name}`);
    let results = await searchWrestlers(req.params.name);
    
    // Apply filters if provided
    const { minVotes, minRating, birthplace } = req.query;
    
    if (minVotes) {
      const minVotesNum = parseInt(minVotes);
      results = results.filter(wrestler => wrestler.votes >= minVotesNum);
    }
    
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      results = results.filter(wrestler => {
        const rating = parseFloat(wrestler.rating);
        return !isNaN(rating) && rating >= minRatingNum;
      });
    }
    
    if (birthplace) {
      const birthplaceFilter = birthplace.toLowerCase();
      results = results.filter(wrestler => 
        wrestler.birthplace && wrestler.birthplace.toLowerCase().includes(birthplaceFilter)
      );
    }
    
    console.log(`Found ${results.length} results (after filters)`);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Failed to search wrestlers", details: err.message });
  }
});

app.get("/api/wrestler/:id", async (req, res) => {
  try {
    console.log(`Fetching profile for ID: ${req.params.id}`);
    const profile = await getWrestlerProfile(req.params.id);
    console.log(`Profile fetched: ${profile.name}, ${profile.matches.length} matches`);
    res.json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch wrestler data", details: err.message });
  }
});

async function getFeaturedWrestlers() {
  const url = "https://www.cagematch.net/?id=2";
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
  });
  const $ = cheerio.load(data);

  let featuredWrestlers = [];
  
  // Look for the section "The most popular active wrestlers"
  $("b, strong").each((_, el) => {
    const text = $(el).text().toLowerCase();
    if (text.includes("most popular active wrestlers") && text.includes("at least 1 match")) {
      // Found the section, now look for the table after it
      let table = $(el).nextAll("table").first();
      if (table.length) {
        table.find("tr").slice(1).each((index, tr) => {
          if (index >= 5) return false; // Only get first 5 wrestlers
          
          const link = $(tr).find("a[href*='id=2&nr=']");
          if (link.length > 0) {
            const href = link.attr("href");
            const match = href.match(/id=2&nr=(\d+)/);
            const name = link.text().trim();
            
            if (match && name) {
              featuredWrestlers.push({
                id: match[1],
                name,
                promotion: "Unknown", // Will be determined from match data
                isActive: true
              });
            }
          }
        });
      }
      return false; // Found what we need, stop searching
    }
  });

  // If we didn't find the section, try alternative search
  if (featuredWrestlers.length === 0) {
    // Look for any table with wrestler links as fallback
    $("table").each((_, table) => {
      const rows = $(table).find("tr").slice(1, 6); // Get first 5 rows
      rows.each((index, tr) => {
        const link = $(tr).find("a[href*='id=2&nr=']");
        if (link.length > 0) {
          const href = link.attr("href");
          const match = href.match(/id=2&nr=(\d+)/);
          const name = link.text().trim();
          
          if (match && name && featuredWrestlers.length < 5) {
            featuredWrestlers.push({
              id: match[1],
              name,
              promotion: "Unknown",
              isActive: true
            });
          }
        }
      });
      
      if (featuredWrestlers.length >= 5) {
        return false; // Stop when we have 5 wrestlers
      }
    });
  }

  return featuredWrestlers.slice(0, 5); // Ensure we only return 5
}

app.get("/api/featured-wrestlers", async (req, res) => {
  try {
    console.log("Fetching featured wrestlers from CageMatch");
    const featuredWrestlers = await getFeaturedWrestlers();
    console.log(`Found ${featuredWrestlers.length} featured wrestlers`);
    res.json(featuredWrestlers);
  } catch (err) {
    console.error("Featured wrestlers fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch featured wrestlers", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

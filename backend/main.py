# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import re
import unicodedata

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TimelineItem(BaseModel):
    event: str
    year: str

class WrestlerProfile(BaseModel):
    name: str
    image_url: str
    bio: str
    height: str
    weight: str
    hometown: str
    timeline: list[TimelineItem]

def normalize(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')).strip().lower()

def scrape_cagematch_wrestler(name: str) -> WrestlerProfile:
    search_url = f"https://www.cagematch.net/?id=666&search={name.replace(' ', '+')}"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    search_resp = requests.get(search_url, headers=headers)
    if search_resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch search results")

    soup = BeautifulSoup(search_resp.text, "html.parser")

    # Find all <a> tags with href containing 'id=2&nr='
    wrestler_links = []
    for a in soup.find_all("a", href=True):
        if "id=2&nr=" in a["href"]:
            # Handle relative URLs
            href = a["href"]
            if href.startswith("?"):
                href = "https://www.cagematch.net/" + href
            wrestler_links.append((a.get_text(strip=True), href))

    if not wrestler_links:
        raise HTTPException(status_code=404, detail="No wrestler links found in search results")

    # Try to find the best match
    norm_query = normalize(name)
    best = None
    for wrestler_name, url in wrestler_links:
        if normalize(wrestler_name) == norm_query:
            best = (wrestler_name, url)
            break
    if not best:
        best = wrestler_links[0]

    profile_link = best[1]

    # Fetch the wrestler profile page
    resp = requests.get(profile_link, headers=headers)
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch wrestler profile")
    soup = BeautifulSoup(resp.text, "html.parser")

    # Parse name
    name_tag = soup.select_one("h1.TextHeader")
    name = name_tag.text.strip() if name_tag else best[0]

    # Parse image (look for any img tag)
    image_url = ""
    image_tag = soup.select_one("img")
    if image_tag and image_tag.has_attr("src"):
        src = image_tag["src"]
        if src.startswith("/"):
            image_url = "https://www.cagematch.net" + src
        else:
            image_url = src

    # Parse bio from Tidbits section
    bio = ""
    tidbits_div = soup.select_one(".Borderless.Font9")
    if tidbits_div:
        bio_text = tidbits_div.get_text(" ", strip=True)
        # Take first 500 characters as bio
        bio = bio_text[:500] + "..." if len(bio_text) > 500 else bio_text
    
    # If no bio, provide default
    if not bio:
        bio = "Professional wrestler with extensive career background."

    # Parse stats from InformationBoxTable
    height = weight = hometown = ""
    info_boxes = soup.select(".InformationBoxTable .InformationBoxRow")
    for box in info_boxes:
        title_elem = box.select_one(".InformationBoxTitle")
        content_elem = box.select_one(".InformationBoxContents")
        
        if title_elem and content_elem:
            label = title_elem.get_text(strip=True).lower()
            value = content_elem.get_text(strip=True)
            
            if "height" in label:
                height = value
            elif "weight" in label:
                weight = value
            elif "birthplace" in label:
                hometown = value

    # Timeline: Leave empty for now
    timeline = []

    return WrestlerProfile(
        name=name,
        image_url=image_url,
        bio=bio,
        height=height,
        weight=weight,
        hometown=hometown,
        timeline=[TimelineItem(**item) for item in timeline],
    )

@app.get("/api/wrestler/{name}", response_model=WrestlerProfile)
def get_wrestler(name: str):
    print(f"Fetching wrestler: {name}")
    try:
        profile = scrape_cagematch_wrestler(name)
        print(f"Successfully scraped: {profile.name}")
        return profile
    except Exception as e:
        print(f"Error scraping {name}: {str(e)}")
        raise e

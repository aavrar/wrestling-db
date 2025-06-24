#!/bin/bash

# Automated backup script for newWrestlingDB
# Usage: ./backup.sh [commit_message]

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}🔄 Starting automated backup...${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Get commit message from argument or use default
COMMIT_MSG="${1:-Auto-backup: $(date +'%Y-%m-%d %H:%M:%S')}"

# Check git status
echo -e "${BLUE}📊 Checking git status...${NC}"
git status --porcelain

# Add all changes
echo -e "${BLUE}➕ Adding all changes...${NC}"
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    exit 0
fi

# Show what will be committed
echo -e "${BLUE}📝 Changes to be committed:${NC}"
git diff --staged --name-only | sed 's/^/  /'

# Commit changes
echo -e "${BLUE}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully committed changes${NC}"
    
    # Ask if user wants to push (when run interactively)
    if [ -t 0 ]; then
        read -p "Push to remote? (y/N): " push_choice
        if [[ $push_choice =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}🚀 Pushing to remote...${NC}"
            git push
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Successfully pushed to remote${NC}"
            else
                echo -e "${RED}❌ Failed to push to remote${NC}"
                exit 1
            fi
        fi
    fi
else
    echo -e "${RED}❌ Failed to commit changes${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
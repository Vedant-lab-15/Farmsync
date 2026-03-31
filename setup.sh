#!/usr/bin/env bash
# =============================================================================
#  FarmSync — One-command setup script
#  Works on macOS and Linux.
#  Run:  bash setup.sh
# =============================================================================

set -e  # exit immediately on any error

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

print_step()  { echo -e "\n${CYAN}${BOLD}▶ $1${NC}"; }
print_ok()    { echo -e "${GREEN}✔ $1${NC}"; }
print_warn()  { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✖ $1${NC}"; }

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${GREEN}${BOLD}"
echo "  ███████╗ █████╗ ██████╗ ███╗   ███╗███████╗██╗   ██╗███╗   ██╗ ██████╗"
echo "  ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝"
echo "  █████╗  ███████║██████╔╝██╔████╔██║███████╗ ╚████╔╝ ██╔██╗ ██║██║     "
echo "  ██╔══╝  ██╔══██║██╔══██╗██║╚██╔╝██║╚════██║  ╚██╔╝  ██║╚██╗██║██║     "
echo "  ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████║   ██║   ██║ ╚████║╚██████╗"
echo "  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝"
echo -e "${NC}"
echo -e "${BOLD}  Farm-to-Market Supply Chain Platform — Setup Script${NC}"
echo "  ──────────────────────────────────────────────────────"

# ── 1. Check Node.js ──────────────────────────────────────────────────────────
print_step "Checking Node.js"

if ! command -v node &>/dev/null; then
  print_error "Node.js is not installed."
  echo "  Please install Node.js 18+ from https://nodejs.org and re-run this script."
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  print_error "Node.js 18+ is required. You have $(node -v)."
  echo "  Download the latest LTS from https://nodejs.org"
  exit 1
fi

print_ok "Node.js $(node -v) found"

# ── 2. Check npm ──────────────────────────────────────────────────────────────
if ! command -v npm &>/dev/null; then
  print_error "npm not found. Please reinstall Node.js."
  exit 1
fi
print_ok "npm $(npm -v) found"

# ── 3. Frontend .env ──────────────────────────────────────────────────────────
print_step "Setting up frontend environment"

if [ ! -f ".env" ]; then
  cp .env.example .env
  print_ok "Created .env from .env.example"
  print_warn "Optional: open .env and add your VITE_GOOGLE_MAPS_API_KEY"
else
  print_ok ".env already exists — skipping"
fi

# ── 4. Backend .env ───────────────────────────────────────────────────────────
print_step "Setting up backend environment"

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env

  # Generate a random JWT secret so it works out of the box
  if command -v openssl &>/dev/null; then
    JWT_SECRET=$(openssl rand -hex 32)
    # Replace placeholder in backend/.env
    sed -i.bak "s|your-super-secret-jwt-key-here|${JWT_SECRET}|g" backend/.env
    rm -f backend/.env.bak
    print_ok "Generated a random JWT_SECRET automatically"
  fi

  print_ok "Created backend/.env from backend/.env.example"
  echo ""
  echo -e "  ${YELLOW}${BOLD}ACTION REQUIRED:${NC}"
  echo -e "  Open ${BOLD}backend/.env${NC} and set your ${BOLD}MONGODB_URI${NC}."
  echo ""
  echo "  Quick options:"
  echo "    • Local MongoDB:  mongodb://localhost:27017/farmsync"
  echo "    • Free Atlas:     https://www.mongodb.com/atlas/database"
  echo ""
  read -rp "  Press ENTER once you've set MONGODB_URI (or ENTER to skip for now)... "
else
  print_ok "backend/.env already exists — skipping"
fi

# ── 5. Install frontend dependencies ─────────────────────────────────────────
print_step "Installing frontend dependencies"
npm install --silent
print_ok "Frontend dependencies installed"

# ── 6. Install backend dependencies ──────────────────────────────────────────
print_step "Installing backend dependencies"
cd backend
npm install --silent
cd ..
print_ok "Backend dependencies installed"

# ── 7. Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}${BOLD}  ✔  Setup complete! Here's how to start FarmSync:${NC}"
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  Open ${BOLD}two terminal windows${NC} in this folder and run:"
echo ""
echo -e "  ${CYAN}Terminal 1 — Backend${NC}"
echo -e "    ${BOLD}cd backend && npm run dev${NC}"
echo ""
echo -e "  ${CYAN}Terminal 2 — Frontend${NC}"
echo -e "    ${BOLD}npm run dev${NC}"
echo ""
echo -e "  Then open ${BOLD}http://localhost:5173${NC} in your browser."
echo -e "  Backend health check: ${BOLD}http://localhost:5000/health${NC}"
echo ""
echo -e "  ${YELLOW}Tip:${NC} Register as a Farmer or Broker on the login page."
echo ""

#!/bin/bash

# CONFIG
SSH_HOST="snowowl"
REMOTE_PATH="/var/www/mastermovies.uk/public/"
SSH_SOCKET="$HOME/.ssh/sockets/%L-%r@%h:%p"
TMP_DIR="/dev/shm/MASTERMOVIES_DEPLOY"

# CONSTANTS
ESCAPE="\033[";
RED="${ESCAPE}31m"
RED_BOLD="${ESCAPE}31;1m"
GREEN="${ESCAPE}32m"
BOLD="${ESCAPE}1m"
BRIGHT_GREEN="${ESCAPE}32;1m"
CYAN="${ESCAPE}36m"
RESET="${ESCAPE}0m"
PREFIX="${BRIGHT_GREEN}[DEPLOY] ${RESET}"

# HELPERS
log () {
  echo -e "${PREFIX}$1"
}

echo;
echo -e "                        ${RED_BOLD}⚠ DANGER ⚠${RESET}"
echo -e "               This action is ${RED}irreversible${RESET}"
echo
echo -ne "${BOLD}Confirm deployment to MasterMovies production server y/N: ${CYAN}"
read -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo -e "${GREEN}Authorized${RESET}\n"

  echo -ne "${BOLD}Would you like to run the build? y/N: ${CYAN}"
  read -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    BUILD=true
  else
    BUILD=false
  fi

  if [ ! -f "package.json" ]; then
    log "${RED}Could not locate package.json${RESET}"
    log "You must be in the root project directory"
    exit 1
  fi

  log "Creating temporary directory"
  mkdir "$TMP_DIR"
  function cleanupTMP {
    log "Deleting temporary files"
    rm -rf "$TMP_DIR" &>/dev/null
  }
  trap cleanupTMP EXIT

  log "Creating SSH socket"
  mkdir -p $(dirname $SSH_SOCKET)
  ssh -M -o "ControlPath=$SSH_SOCKET" -fnNT $SSH_HOST &>/dev/null

  if [ "$?" != 0 ]; then
    log "${RED}Failed to create SSH socket${RESET}"
    exit 1
  fi

  function cleanupSSH {
    cleanupTMP
    log "Closing SSH connection"
    ssh -O stop -o "ControlPath=$SSH_SOCKET" $SSH_HOST
  }
  trap cleanupSSH EXIT

  log "Copying build files to RAM"

  if [ "$BUILD" = false ]; then

    rsync -a --include 'public/' --include 'public/***' --exclude '*' . $TMP_DIR

    if [ "$?" != 0 ]; then
      log "${RED}Failed to copy files to RAM${RESET}"
      exit 1
    fi

  else

    rsync -a --exclude 'node_modules/' --exclude '.cache/' --exclude 'public/' . $TMP_DIR

    if [ "$?" != 0 ]; then
      log "${RED}Failed to copy files to RAM${RESET}"
      exit 1
    fi

    log "Installing dependancies"
    (cd "$TMP_DIR"; npm ci > /dev/null)

    if [ "$?" != 0 ]; then
      log "${RED}Failed to install NPM dependancies${RESET}"
      exit 1
    fi

    log "Building project"
    (cd "$TMP_DIR"; npm run build &> /dev/null)

    if [ "$?" != 0 ]; then
      log "${RED}Failed to build project${RESET}"
      exit 1
    fi

  fi

  log "Uploading to production server"
  rsync -zam --delete --no-perms --no-owner --no-group -e "ssh -o 'ControlPath=$SSH_SOCKET'" "$TMP_DIR/public/" $SSH_HOST:${REMOTE_PATH} >/dev/null

  if [ "$?" != 0 ]; then
    log "${RED}Failed to move build files to production server${RESET}"
    exit 1
  fi

  log "Setting correct permissions"
  ssh -o "Controlpath=$SSH_SOCKET" -t "$SSH_HOST" "find ${REMOTE_PATH%/}/* -type d -execdir chmod 755 {} \;;find ${REMOTE_PATH%/}/* -type f -execdir chmod 744 {} \;;" >/dev/null

  if [ "$?" != 0 ]; then
    log "${RED}Failed to move build files to production server${RESET}"
    exit 1
  fi

  log "${GREEN}Complete${RESET}"

else
  echo -e "${RED}Unauthorized${RESET}\n"
fi

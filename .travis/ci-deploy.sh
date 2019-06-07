#!/bin/bash
set -e

SSH_HOST="deploy@snowowl.mastermovies.uk"
REMOTE_PATH="/var/www/mastermovies.uk/public/"
DEPLOY_KEY=".travis/deploy_key"


# Upload to production server
echo "[DEPLOY] Deploying static files to production server"
rsync -rzm --delete-after --no-perms --no-owner --no-group -e "ssh -o 'NumberOfPasswordPrompts 0' -o BatchMode=yes -i '${DEPLOY_KEY}'" public/ "${SSH_HOST}:${REMOTE_PATH}"
if [ "$?" != 0 ]; then
  exit "$?"
fi


# Purge CloudFlare
echo "[DEPLOY] Purging CloudFlare cache"
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/ea97a86fe50aecf08427c82af9544293/purge_cache" \
    -H "X-Auth-Email: marcus.cemes@gmail.com" \
    -H "X-Auth-Key: $CLOUDFLARE_KEY" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
if [ "$?" != 0 ]; then
  exit "$?"
fi
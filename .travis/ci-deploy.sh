#!/bin/bash
set -e

SSH_HOST="marcus@api.mastermovies.uk"
REMOTE_PATH="/var/www/mastermovies.uk/public/"
DEPLOY_KEY=".travis/deploy_key"

# Upload to production server
echo "Deploying static files to production server"
rsync -zam --delete --no-perms --no-owner --no-group -e "ssh -o 'NumberOfPasswordPrompts 0' -o BatchMode=yes -i ${DEPLOY_KEY}" "./public/" ${SSH_HOST}:${REMOTE_PATH}
if [ "$?" != 0 ]; then
  exit "$?"
fi

# Set permissions
echo "Setting static file permissions on production server"
ssh -o 'NumberOfPasswordPrompts 0' -o BatchMode=yes -i ${DEPLOY_KEY} "$SSH_HOST" "find ${REMOTE_PATH%/}/* -type d -execdir chmod 755 {} \;;find ${REMOTE_PATH%/}/* -type f -execdir chmod 744 {} \;;"
if [ "$?" != 0 ]; then
  exit "$?"
fi

# Purge CloudFlare
echo "Purging CloudFlare cache"
curl -X POST "https://api.cloudflare.com/client/v4/zones/ea97a86fe50aecf08427c82af9544293/purge_cache" \
    -H "X-Auth-Email: marcus.cemes@gmail.com" \
    -H "X-Auth-Key: $CLOUDFLARE_KEY" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
if [ "$?" != 0 ]; then
  exit "$?"
fi
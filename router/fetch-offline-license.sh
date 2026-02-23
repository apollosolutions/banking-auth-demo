set -e

# Requires enterprise support
source .env

# Do NOT check in this license file to VCS
rover license fetch --graph-id router-playground > entitlement.jwt

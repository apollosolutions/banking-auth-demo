#!/bin/bash
# Get an Auth0 access token for testing the Banking Demo API
#
# Usage:
#   1. Copy .env.auth0.sample to .env.auth0 and fill in your Auth0 credentials
#   2. Run: ./get-token.sh
#   3. Use the token in your requests: Authorization: Bearer <token>

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.auth0"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env.auth0 file not found!"
    echo ""
    echo "Please create it by copying the sample file:"
    echo "  cp .env.auth0.sample .env.auth0"
    echo ""
    echo "Then fill in your Auth0 credentials."
    exit 1
fi

# Load environment variables
source "$ENV_FILE"

# Validate required variables
if [ -z "$AUTH0_DOMAIN" ] || [ "$AUTH0_DOMAIN" = "your-tenant.us.auth0.com" ]; then
    echo "Error: AUTH0_DOMAIN is not configured in .env.auth0"
    exit 1
fi

if [ -z "$AUTH0_CLIENT_ID" ] || [ "$AUTH0_CLIENT_ID" = "your-client-id" ]; then
    echo "Error: AUTH0_CLIENT_ID is not configured in .env.auth0"
    exit 1
fi

if [ -z "$AUTH0_CLIENT_SECRET" ] || [ "$AUTH0_CLIENT_SECRET" = "your-client-secret" ]; then
    echo "Error: AUTH0_CLIENT_SECRET is not configured in .env.auth0"
    exit 1
fi

echo "Requesting token from Auth0..."
echo "Domain: ${AUTH0_DOMAIN}"
echo "Audience: ${AUTH0_AUDIENCE}"
echo ""

RESPONSE=$(curl -s --request POST \
  --url "https://${AUTH0_DOMAIN}/oauth/token" \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\": \"${AUTH0_CLIENT_ID}\",
    \"client_secret\": \"${AUTH0_CLIENT_SECRET}\",
    \"audience\": \"${AUTH0_AUDIENCE}\",
    \"grant_type\": \"client_credentials\"
   

  }")
    #  \"scope\": \"read:pii read:customers read:accounts write:transfers\"
# Check if jq is available
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
    ERROR=$(echo "$RESPONSE" | jq -r '.error // empty')
    ERROR_DESC=$(echo "$RESPONSE" | jq -r '.error_description // empty')
    
    if [ -n "$ERROR" ]; then
        echo "Error: $ERROR"
        echo "Description: $ERROR_DESC"
        exit 1
    fi
    
    if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
        echo "Error: Failed to get token"
        echo "Response: $RESPONSE"
        exit 1
    fi
    
    echo "Access Token:"
    echo "============="
    echo "$TOKEN"
    echo ""
    echo "Token expires in: $(echo "$RESPONSE" | jq -r '.expires_in') seconds"
    echo ""
    echo "Use in requests:"
    echo "  Authorization: Bearer $TOKEN"
else
    echo "Response (install jq for formatted output):"
    echo "$RESPONSE"
fi

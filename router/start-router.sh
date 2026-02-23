set -e

# Start the router sourcing the graph ref and API key from .env
source .env

./router \
  --config router.yaml \
  --supergraph supergraph.graphql \
  --dev

set -e

# Start the router sourcing the graph ref and API key from .env
source .env

./router \
  --config router.yaml --dev 
  # --supergraph supergraph.graphql \
  # --dev

#rover dev \
#  --supergraph-config supergraph.yaml \
#  --router-config router.yaml

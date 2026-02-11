#!/bin/bash
set -e;

source ../router/.env;

# Customers
rover subgraph publish "$APOLLO_GRAPH_REF" \
  --schema ./customers/schema.graphql \
  --name customers \
  --routing-url http://localhost:4001/customers/graphql

# Accounts
rover subgraph publish "$APOLLO_GRAPH_REF" \
  --schema ./accounts/schema.graphql \
  --name accounts \
  --routing-url http://localhost:4001/accounts/graphql

# Transactions
rover subgraph publish "$APOLLO_GRAPH_REF" \
  --schema ./transactions/schema.graphql \
  --name transactions \
  --routing-url http://localhost:4001/transactions/graphql

# Transfers
rover subgraph publish "$APOLLO_GRAPH_REF" \
  --schema ./transfers/schema.graphql \
  --name transfers \
  --routing-url http://localhost:4001/transfers/graphql

# Banking Demo - Apollo Federation

A federated GraphQL demo for retail banking, demonstrating Apollo Router with JWT authentication and authorization directives.

## Architecture

This demo consists of four federated subgraphs that work together to provide a complete banking API:

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Client    │────▶│  Apollo Router  │────▶│    Subgraphs     │
│             │     │   (port 4000)   │     │   (port 4001)    │
└─────────────┘     └─────────────────┘     └──────────────────┘
                            │                       │
                            ▼                       ├── /customers/graphql
                    ┌───────────────┐               ├── /accounts/graphql
                    │   Auth0 JWT   │               ├── /transactions/graphql
                    │   Validation  │               └── /transfers/graphql
                    └───────────────┘
```

### Subgraphs

| Subgraph | Description | Key Entities |
|----------|-------------|--------------|
| **customers** | Customer profiles and KYC info | `Customer`, `Address` |
| **accounts** | Bank accounts (checking, savings) | `Account`, extends `Customer` |
| **transactions** | Transaction history | `Transaction`, extends `Account` |
| **transfers** | Money transfers between accounts | `Transfer`, mutations |

### Entity Relationships

- **Customer** → owns multiple **Accounts**
- **Account** → has multiple **Transactions**
- **Transfer** → links source and destination **Accounts**

## Authentication & Authorization

This demo uses Auth0 for JWT authentication with Apollo Router's native JWT validation.

### Authorization Directives

| Directive | Description | Example |
|-----------|-------------|---------|
| `@authenticated` | Requires valid JWT | `balance: Float! @authenticated` |
| `@requiresScopes` | Requires specific OAuth scopes | `ssn: String @requiresScopes(scopes: [["read:pii"]])` |

### Required Scopes

| Scope | Description |
|-------|-------------|
| `read:pii` | Access to PII fields (SSN, DOB, address) |
| `read:customers` | Access to customer queries |
| `read:accounts` | Access to account queries |
| `write:transfers` | Create/cancel transfers |

### JWT Claims

The application uses the following JWT claims for authentication and authorization:

#### Standard Claims

| Claim | Description | Example |
|-------|-------------|---------|
| `sub` | Subject identifier (user/client ID) | `"auth0\|123456"` or `"customer:1"` |
| `iss` | Token issuer (Auth0 domain) | `"https://your-tenant.us.auth0.com/"` |
| `aud` | Audience (API identifier) | `"https://banking-demo-api"` |
| `scope` | Space-separated list of granted scopes | `"read:pii read:customers write:transfers"` |
| `exp` | Token expiration timestamp | `1234567890` |

#### Custom Claims for Policy Evaluation

The coprocessor uses these custom claims for the `@policy` directive:

| Claim | Type | Description | Example Values |
|-------|------|-------------|----------------|
| `transfer_limit` | `number` or `"unlimited"` | Maximum transfer amount allowed | `50000`, `"unlimited"` |
| `customer_id` | `string` | Customer identifier for `me` query | `"customer:1"` |

#### Example JWT Payload

```json
{
  "iss": "https://your-tenant.us.auth0.com/",
  "sub": "auth0|abc123",
  "aud": "https://banking-demo-api",
  "scope": "read:pii read:customers read:accounts write:transfers",
  "exp": 1234567890,
  "iat": 1234567800,
  "customer_id": "customer:1",
  "transfer_limit": 50000
}
```

#### Adding Custom Claims in Auth0

To add custom claims to your tokens in Auth0:

1. Go to **Auth Pipeline > Rules** (or **Actions > Flows > Login**)
2. Create a new rule/action to add claims:

```javascript
// Auth0 Rule or Action
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://banking-demo-api/';
  
  // Add custom claims
  api.accessToken.setCustomClaim(`${namespace}customer_id`, 'customer:1');
  api.accessToken.setCustomClaim(`${namespace}transfer_limit`, 50000);
};
```

3. The claims will be available in the JWT as:
   - `https://banking-demo-api/customer_id`
   - `https://banking-demo-api/transfer_limit`

> **Note:** Auth0 requires custom claims to be namespaced with a URL to avoid conflicts with standard claims.

### Auth0 Setup

Follow these steps to configure Auth0 for this demo:

#### Step 1: Create an Auth0 Account

1. Go to [auth0.com](https://auth0.com) and sign up for a free account
2. After signing up, you'll have a tenant with a domain like `your-tenant.us.auth0.com`

#### Step 2: Create an API

1. In the Auth0 Dashboard, go to **Applications > APIs**
2. Click **+ Create API**
3. Fill in the details:
   - **Name:** `Banking Demo API`
   - **Identifier:** `https://banking-demo-api` (this is your audience)
   - **Signing Algorithm:** `RS256`
4. Click **Create**

#### Step 3: Configure API Permissions (Scopes)

1. After creating the API, go to the **Permissions** tab
2. Add the following permissions (scopes):

   | Permission | Description |
   |------------|-------------|
   | `read:pii` | Read personally identifiable information |
   | `read:customers` | Read customer data |
   | `read:accounts` | Read account information |
   | `write:transfers` | Create and manage transfers |

3. Click **+ Add** for each permission

#### Step 4: Create a Test Application

1. Go to **Applications > Applications**
2. Click **+ Create Application**
3. Fill in the details:
   - **Name:** `Banking Demo Test App`
   - **Application Type:** Select **Machine to Machine Applications**
4. Click **Create**
5. Select the **Banking Demo API** you created earlier
6. Select **all permissions** (scopes) and click **Authorize**

#### Step 5: Get Your Credentials

After creating the application, go to the **Settings** tab and note:

- **Domain:** `your-tenant.us.auth0.com`
- **Client ID:** `xxxxxxxxxxxxxxxxxxxxxxxx`
- **Client Secret:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### Step 6: Update Router Configuration

Update `router/router.yaml` with your Auth0 domain:

```yaml
authentication:
  router:
    jwt:
      jwks:
        - url: https://YOUR_TENANT.us.auth0.com/.well-known/jwks.json
```

Replace `YOUR_TENANT` with your actual Auth0 tenant name.

#### Step 7: Get a Test Token

You can get a test token using curl:

```bash
curl --request POST \
  --url https://YOUR_TENANT.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "audience": "https://banking-demo-api",
    "grant_type": "client_credentials",
    "scope": "read:pii read:customers read:accounts write:transfers"
  }'
```

The response will include an `access_token`:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

#### Step 8: Test with the Token

Use the token in your GraphQL requests:

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"query": "{ me { id firstName lastName email } }"}'
```

#### Quick Setup Script

For convenience, create a `.env.auth0` file in the router directory:

```bash
# router/.env.auth0
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://banking-demo-api
```

Then use this script to get a token:

```bash
#!/bin/bash
# get-token.sh
source .env.auth0

TOKEN=$(curl -s --request POST \
  --url "https://${AUTH0_DOMAIN}/oauth/token" \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\": \"${AUTH0_CLIENT_ID}\",
    \"client_secret\": \"${AUTH0_CLIENT_SECRET}\",
    \"audience\": \"${AUTH0_AUDIENCE}\",
    \"grant_type\": \"client_credentials\",
    \"scope\": \"read:pii read:customers read:accounts write:transfers\"
  }" | jq -r '.access_token')

echo "Token: $TOKEN"
```

#### Troubleshooting Auth0

| Issue | Solution |
|-------|----------|
| `invalid_token` error | Check that the JWKS URL in router.yaml matches your Auth0 domain |
| `insufficient_scope` error | Ensure your token request includes the required scopes |
| Token expired | Request a new token (tokens expire after 24 hours by default) |
| `Unauthorized` | Verify the Authorization header format: `Bearer <token>` |

#### Decoding JWT Tokens

To inspect your token, use [jwt.io](https://jwt.io) or decode it locally:

```bash
# Decode token payload (middle part)
echo "YOUR_TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .
```

The token should contain:
```json
{
  "iss": "https://your-tenant.us.auth0.com/",
  "sub": "client-id@clients",
  "aud": "https://banking-demo-api",
  "scope": "read:pii read:customers read:accounts write:transfers",
  "exp": 1234567890
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- Apollo Router binary
- Auth0 account (for authentication)

### Starting Subgraphs

```bash
cd subgraphs/
npm install
npm start
```

The subgraphs will start on port 4001 with the following endpoints:
- http://localhost:4001/customers/graphql
- http://localhost:4001/accounts/graphql
- http://localhost:4001/transactions/graphql
- http://localhost:4001/transfers/graphql

### Starting Router

```bash
cd router/

# Setup environment (copy and configure .env.sample)
cp .env.sample .env

# Download Router binary
./download-router.sh

# Compose supergraph schema
./compose.sh

# Start Router
./start-router.sh
```

The router will start on http://localhost:4000

## Example Queries

### Get Current Customer with Accounts

```graphql
query GetMe {
  me {
    id
    firstName
    lastName
    email
    accounts {
      id
      accountNumber
      accountType
      balance
      availableBalance
    }
  }
}
```

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

### Get Account with Transactions

```graphql
query GetAccountTransactions($accountId: ID!) {
  account(id: $accountId) {
    id
    accountNumber
    balance
    transactions(limit: 10) {
      id
      amount
      type
      status
      description
      merchantName
      category
      timestamp
    }
  }
}
```

### Initiate a Transfer

```graphql
mutation InitiateTransfer($input: TransferInput!) {
  initiateTransfer(input: $input) {
    id
    amount
    status
    fromAccount {
      id
      accountNumber
    }
    toAccount {
      id
      accountNumber
    }
    memo
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "fromAccountId": "account:1",
    "toAccountId": "account:2",
    "amount": 100.00,
    "memo": "Monthly savings"
  }
}
```

**Required Scope:** `write:transfers`

### Query with PII Access

```graphql
query GetCustomerPII($id: ID!) {
  customer(id: $id) {
    id
    firstName
    lastName
    dateOfBirth
    ssn
    address {
      street
      city
      state
      zipCode
    }
  }
}
```

**Required Scopes:** `read:customers`, `read:pii`

## Mock Data

### Customers

| ID | Name | KYC Status | Accounts |
|----|------|------------|----------|
| customer:1 | John Smith | VERIFIED | 2 (Checking + Savings) |
| customer:2 | Jane Doe | VERIFIED | 3 (Checking + Savings + Money Market) |
| customer:3 | Bob Wilson | PENDING | 1 (Checking) |

### Testing Without Auth

For local development without Auth0, you can use the `x-customer-id` header:

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "x-customer-id: customer:1" \
  -d '{"query": "{ me { firstName lastName } }"}'
```

## Policy-Based Authorization

This demo includes a `@policy` directive example for transaction limits using a coprocessor.

### HIGH_VALUE_TRANSFER Policy

Transfers over $10,000 require elevated authorization. The policy is evaluated by the coprocessor:

```graphql
# In transfers schema
initiateTransfer(input: TransferInput!): Transfer! 
  @policy(policies: [["HIGH_VALUE_TRANSFER"]])
```

### Policy Authorization Requirements

| Transfer Amount | Authorization Required |
|----------------|----------------------|
| ≤ $10,000 | Valid JWT token only (policy auto-passes) |
| > $10,000 | JWT claim OR elevated header (see below) |

**For transfers > $10,000, you need ONE of:**

1. **JWT Claim `transfer_limit`:**
   - `transfer_limit: "unlimited"` - allows any amount
   - `transfer_limit: <number>` - allows transfers up to that amount

2. **Header `x-authorization-level`:**
   - `elevated` - allows high-value transfers
   - `admin` - allows high-value transfers

### How It Works

1. **Router** receives transfer request and extracts required policies
2. **Coprocessor** evaluates the `HIGH_VALUE_TRANSFER` policy:
   - Checks transfer amount from GraphQL variables (`input.amount`)
   - If amount ≤ $10,000: Policy passes automatically
   - If amount > $10,000: Checks JWT claims first, then falls back to header
3. **Router** enforces the policy result - blocks request if policy fails

### Starting the Coprocessor

```bash
cd coprocessor/
npm install
node index.js
```

The coprocessor runs on http://localhost:3080

### Testing Policies

```bash
# Transfer under $10,000 (passes)
curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { initiateTransfer(input: { fromAccountId: \"account:1\", toAccountId: \"account:2\", amount: 5000 }) { id status } }", "variables": {"input": {"fromAccountId": "account:1", "toAccountId": "account:2", "amount": 5000}}}'

# Transfer over $10,000 with elevated access
curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -H "x-authorization-level: elevated" \
  -d '{"query": "mutation { initiateTransfer(input: { fromAccountId: \"account:1\", toAccountId: \"account:2\", amount: 15000 }) { id status } }", "variables": {"input": {"fromAccountId": "account:1", "toAccountId": "account:2", "amount": 15000}}}'
```

### Policy Configuration

Edit `coprocessor/index.js` to customize policies:

```javascript
const POLICY_CONFIG = {
  HIGH_VALUE_TRANSFER: {
    threshold: 10000,  // Amount threshold
    requiredHeader: "x-authorization-level"
  }
};
```

## Enterprise Features

This demo can be extended with Apollo Router enterprise features:

- **Coprocessor** - Custom request/response processing (enabled for policies)
- **APQ (Automatic Persisted Queries)** - Redis-backed query caching
- **Entity Cache** - Caching entity data in Redis
- **Demand Control** - Rate limiting and cost estimation

See the commented sections in `router/router.yaml` for configuration examples.

## Project Structure

```
├── router/
│   ├── router.yaml              # Router configuration with JWT auth & coprocessor
│   ├── supergraph.yaml          # Subgraph composition config
│   ├── supergraph.graphql       # Composed supergraph schema
│   ├── .env.sample              # Environment variables template
│   ├── .env.auth0.sample        # Auth0 credentials template
│   ├── compose.sh               # Compose supergraph schema
│   ├── download-router.sh       # Download Apollo Router binary
│   ├── download-rover.sh        # Download Rover CLI
│   ├── fetch-offline-license.sh # Fetch offline enterprise license
│   ├── get-token.sh             # Script to get Auth0 tokens
│   ├── rover-dev.sh             # Run Rover in dev mode
│   └── start-router.sh         # Start Apollo Router
├── subgraphs/
│   ├── customers/               # Customer profiles subgraph
│   ├── accounts/                # Bank accounts subgraph
│   ├── transactions/            # Transaction history subgraph
│   └── transfers/               # Money transfers subgraph (with @policy)
└── coprocessor/
    └── index.js                 # Policy evaluation (HIGH_VALUE_TRANSFER)
```

## License

MIT

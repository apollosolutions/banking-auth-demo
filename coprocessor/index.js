const express = require("express");
const app = express();
const port = process.env.PORT || 3080;

app.use(express.json());

// =============================================================================
// Policy Configuration
// =============================================================================

const POLICY_CONFIG = {
  HIGH_VALUE_TRANSFER: {
    description: "Transfers over $10,000 require elevated permissions",
    threshold: 10000,
    requiredClaim: "transfer_limit",       // JWT claim to check
    requiredHeader: "x-authorization-level" // Fallback header for testing
  }
};

// =============================================================================
// Policy Evaluation Functions
// =============================================================================

/**
 * Evaluate the HIGH_VALUE_TRANSFER policy
 * 
 * Rules:
 * - Transfers <= $10,000 are always allowed
 * - Transfers > $10,000 require:
 *   - JWT claim "transfer_limit" >= amount OR "unlimited"
 *   - OR header "x-authorization-level" = "elevated" or "admin"
 */
const evaluateHighValueTransfer = (payload) => {
  const { body, headers, context } = payload;
  
  // Extract transfer amount from GraphQL variables
  // Support any variable name (e.g., $input, $i, $data, etc.)
  const variables = body?.variables || {};
  let amount = 0;
  
  // Look for amount in any variable that contains TransferInput
  for (const key of Object.keys(variables)) {
    if (variables[key]?.amount !== undefined) {
      amount = variables[key].amount;
      break;
    }
  }
  
  console.log(`[HIGH_VALUE_TRANSFER] Evaluating transfer amount: $${amount}`);
  
  // If amount is under threshold, policy passes automatically
  if (amount <= POLICY_CONFIG.HIGH_VALUE_TRANSFER.threshold) {
    console.log(`[HIGH_VALUE_TRANSFER] Amount under threshold ($${POLICY_CONFIG.HIGH_VALUE_TRANSFER.threshold}), policy PASSES`);
    return true;
  }
  
  console.log(`[HIGH_VALUE_TRANSFER] High-value transfer detected, checking authorization...`);
  
  // For high-value transfers, check authorization level
  // Option 1: Check JWT claims (from router context)
  const claims = context?.entries?.["apollo_authentication::JWT::claims"];
  if (claims) {
    console.log(`[HIGH_VALUE_TRANSFER] JWT claims found:`, JSON.stringify(claims));
    
    if (claims.transfer_limit === "unlimited") {
      console.log(`[HIGH_VALUE_TRANSFER] User has unlimited transfer limit, policy PASSES`);
      return true;
    }
    
    if (typeof claims.transfer_limit === "number" && claims.transfer_limit >= amount) {
      console.log(`[HIGH_VALUE_TRANSFER] User transfer limit ($${claims.transfer_limit}) >= amount, policy PASSES`);
      return true;
    }
  }
  
  // Option 2: Check header (for demo/testing without real JWT claims)
  const authLevel = headers?.[POLICY_CONFIG.HIGH_VALUE_TRANSFER.requiredHeader]?.[0];
  if (authLevel) {
    console.log(`[HIGH_VALUE_TRANSFER] Authorization level header: ${authLevel}`);
    
    if (authLevel === "elevated" || authLevel === "admin") {
      console.log(`[HIGH_VALUE_TRANSFER] Elevated authorization level, policy PASSES`);
      return true;
    }
  }
  
  console.log(`[HIGH_VALUE_TRANSFER] No elevated authorization found, policy FAILS`);
  return false;
};

/**
 * Map of policy names to their evaluation functions
 */
const policyEvaluators = {
  HIGH_VALUE_TRANSFER: evaluateHighValueTransfer
};

// =============================================================================
// Coprocessor Stage Handlers
// =============================================================================

const processRouterRequestStage = async (payload) => {
  console.log("[RouterRequest] Processing...");
  return payload;
};

const processRouterResponseStage = async (payload) => {
  console.log("[RouterResponse] Processing...");
  return payload;
};

const processSupergraphRequestStage = async (payload) => {
  console.log("[SupergraphRequest] Processing...");
  console.log("[SupergraphRequest] Context entries:", JSON.stringify(payload.context?.entries, null, 2));
  
  const { context } = payload;
  
  // Get required policies from context (Apollo Router uses this key)
  const policies = context?.entries?.["apollo::authorization::required_policies"];
  
  if (policies) {
    console.log("[SupergraphRequest] Policies to evaluate:", Object.keys(policies));
    
    // Evaluate each required policy
    for (const policy of Object.keys(policies)) {
      const evaluator = policyEvaluators[policy];
      
      if (evaluator) {
        const result = evaluator(payload);
        policies[policy] = result;
        console.log(`[SupergraphRequest] Policy "${policy}" evaluated to: ${result}`);
      } else {
        console.warn(`[SupergraphRequest] Unknown policy: ${policy}, defaulting to false`);
        policies[policy] = false;
      }
    }
    
    // Update context with results (Apollo Router uses this key)
    payload.context.entries["apollo::authorization::required_policies"] = policies;
    console.log("[SupergraphRequest] Updated policies:", JSON.stringify(policies, null, 2));
  } else {
    console.log("[SupergraphRequest] No policies to evaluate");
  }
  
  console.log("[SupergraphRequest] Returning payload with context:", JSON.stringify(payload.context?.entries, null, 2));
  return payload;
};

const processSubgraphRequest = async (payload) => {
  console.log("[SubgraphRequest] Processing...");
  return payload;
};

// =============================================================================
// Express Routes
// =============================================================================

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", policies: Object.keys(POLICY_CONFIG) });
});

// Main coprocessor endpoint
// See: https://www.apollographql.com/docs/router/customizations/coprocessor
app.post("/", async (req, res) => {
  const payload = req.body;
  const stage = payload.stage;
  
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[Coprocessor] Received ${stage} request`);
  console.log(`${"=".repeat(60)}`);

  let response = payload;
  
  try {
    switch (stage) {
      case "RouterRequest":
        response = await processRouterRequestStage(response);
        break;
      case "RouterResponse":
        response = await processRouterResponseStage(response);
        break;
      case "SupergraphRequest":
        response = await processSupergraphRequestStage(response);
        break;
      case "SubgraphRequest":
        response = await processSubgraphRequest(response);
        break;
      default:
        console.error(`[Coprocessor] Unknown stage: ${stage}`);
        break;
    }
  } catch (error) {
    console.error(`[Coprocessor] Error processing ${stage}:`, error);
  }

  res.send(response);
});

// =============================================================================
// Server Startup
// =============================================================================

app.listen(port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          Banking Demo Coprocessor                            ║
╠══════════════════════════════════════════════════════════════╣
║  Port: ${port}                                                  ║
║  Health: http://localhost:${port}/health                        ║
╠══════════════════════════════════════════════════════════════╣
║  Configured Policies:                                        ║
║  • HIGH_VALUE_TRANSFER - Transfers > $10,000 need elevation  ║
╠══════════════════════════════════════════════════════════════╣
║  Note: Requires Apollo Router Enterprise license             ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

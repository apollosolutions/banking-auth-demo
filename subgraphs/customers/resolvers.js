import { CUSTOMERS } from "./data.js";

const getCustomerById = (id) => CUSTOMERS.find((it) => it.id === id);

export const resolvers = {
  Query: {
    me(_, __, context) {
      // Get customer ID from JWT claims (set by router) or fallback to header
      const jwtClaims = context.req?.headers?.["x-apollo-jwt-claims"];
      let customerId;
      
      if (jwtClaims) {
        try {
          const parsed = JSON.parse(jwtClaims);
          customerId = parsed.sub || parsed.customer_id;
        } catch (e) {
          // Invalid JWT claims format, fall through to header check
        }
      }
      
      // Fallback to headers for testing - this is the recommended way for demos
      // In production with real user auth (not M2M), the JWT sub claim would work
      customerId = customerId || context.headers["x-customer-id"] || context.headers["x-user-id"];
      
      if (!customerId) {
        // Return null instead of throwing to avoid exposing internals
        // The @authenticated directive should block unauthenticated requests at router level
        return null;
      }

      const customer = getCustomerById(customerId);

      if (!customer) {
        // Return null for non-existent customer instead of throwing with stacktrace
        return null;
      }

      return customer;
    },
    customer(_, { id }) {
      return getCustomerById(id);
    },
    customers() {
      return CUSTOMERS;
    }
  },
  Customer: {
    __resolveReference(ref) {
      return getCustomerById(ref.id);
    }
  }
};

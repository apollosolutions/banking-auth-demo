import { TRANSACTIONS } from "./data.js";

const getTransactionById = (id) => TRANSACTIONS.find((it) => it.id === id);
const getTransactionsByAccountId = (accountId) => TRANSACTIONS.filter((it) => it.accountId === accountId);

export const resolvers = {
  Query: {
    transaction: (_, { id }) => getTransactionById(id)
  },
  Transaction: {
    __resolveReference(ref) {
      return getTransactionById(ref.id);
    },
    account(transaction) {
      // Return just the reference for federation to resolve
      return { id: transaction.accountId };
    }
  },
  Account: {
    transactions(account, { limit = 10, offset = 0 }) {
      const accountTransactions = getTransactionsByAccountId(account.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return accountTransactions.slice(offset, offset + limit);
    },
    recentTransactions(account) {
      return getTransactionsByAccountId(account.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    }
  }
};

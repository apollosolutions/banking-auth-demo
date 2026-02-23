import { ACCOUNTS } from "./data.js";

const getAccountById = (id) => ACCOUNTS.find((it) => it.id === id);
const getAccountByNumber = (accountNumber) => ACCOUNTS.find((it) => it.accountNumber === accountNumber);
const getAccountsByCustomerId = (customerId) => ACCOUNTS.filter((it) => it.customerId === customerId);

export const resolvers = {
  Query: {
    account: (_, { id }) => getAccountById(id),
    accountByNumber: (_, { accountNumber }) => getAccountByNumber(accountNumber)
  },
  Account: {
    __resolveReference(ref) {
      return getAccountById(ref.id);
    }
  },
  Customer: {
    accounts(customer) {
      return getAccountsByCustomerId(customer.id);
    }
  }
};

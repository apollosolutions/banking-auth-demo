export const ACCOUNTS = [
  // Customer 1 (John Smith) - 2 accounts
  {
    id: "account:1",
    customerId: "customer:1",
    accountNumber: "1234567890",
    accountType: "CHECKING",
    balance: 5432.50,
    availableBalance: 5232.50,
    currency: "USD",
    status: "ACTIVE",
    openedDate: "2023-01-15",
    interestRate: 0.01
  },
  {
    id: "account:2",
    customerId: "customer:1",
    accountNumber: "1234567891",
    accountType: "SAVINGS",
    balance: 25000.00,
    availableBalance: 25000.00,
    currency: "USD",
    status: "ACTIVE",
    openedDate: "2023-01-15",
    interestRate: 4.5
  },
  // Customer 2 (Jane Doe) - 3 accounts
  {
    id: "account:3",
    customerId: "customer:2",
    accountNumber: "2345678901",
    accountType: "CHECKING",
    balance: 12750.25,
    availableBalance: 12550.25,
    currency: "USD",
    status: "ACTIVE",
    openedDate: "2023-03-20",
    interestRate: 0.01
  },
  {
    id: "account:4",
    customerId: "customer:2",
    accountNumber: "2345678902",
    accountType: "SAVINGS",
    balance: 50000.00,
    availableBalance: 50000.00,
    currency: "USD",
    status: "ACTIVE",
    openedDate: "2023-03-20",
    interestRate: 4.75
  },
  {
    id: "account:5",
    customerId: "customer:2",
    accountNumber: "2345678903",
    accountType: "MONEY_MARKET",
    balance: 75000.00,
    availableBalance: 75000.00,
    currency: "USD",
    status: "ACTIVE",
    openedDate: "2023-06-01",
    interestRate: 5.0
  },
  // Customer 3 (Bob Wilson) - 1 account
  {
    id: "account:6",
    customerId: "customer:3",
    accountNumber: "3456789012",
    accountType: "CHECKING",
    balance: 1250.75,
    availableBalance: 1050.75,
    currency: "USD",
    status: "ACTIVE",
    openedDate: "2024-01-05",
    interestRate: 0.01
  }
];

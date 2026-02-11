export const TRANSACTIONS = [
  // Account 1 (John's Checking) transactions
  {
    id: "txn:1",
    accountId: "account:1",
    amount: -125.50,
    type: "DEBIT",
    status: "COMPLETED",
    description: "Whole Foods Market",
    merchantName: "Whole Foods",
    category: "GROCERIES",
    timestamp: "2024-01-28T10:30:00Z",
    runningBalance: 5432.50
  },
  {
    id: "txn:2",
    accountId: "account:1",
    amount: -45.00,
    type: "DEBIT",
    status: "COMPLETED",
    description: "Netflix Subscription",
    merchantName: "Netflix",
    category: "ENTERTAINMENT",
    timestamp: "2024-01-27T00:00:00Z",
    runningBalance: 5558.00
  },
  {
    id: "txn:3",
    accountId: "account:1",
    amount: 3500.00,
    type: "CREDIT",
    status: "COMPLETED",
    description: "Payroll Deposit - ACME Corp",
    merchantName: "ACME Corp",
    category: "INCOME",
    timestamp: "2024-01-26T09:00:00Z",
    runningBalance: 5603.00
  },
  {
    id: "txn:4",
    accountId: "account:1",
    amount: -200.00,
    type: "TRANSFER_OUT",
    status: "COMPLETED",
    description: "Transfer to Savings",
    merchantName: null,
    category: "TRANSFER",
    timestamp: "2024-01-25T14:30:00Z",
    runningBalance: 2103.00
  },
  {
    id: "txn:5",
    accountId: "account:1",
    amount: -89.99,
    type: "DEBIT",
    status: "PENDING",
    description: "Amazon.com",
    merchantName: "Amazon",
    category: "SHOPPING",
    timestamp: "2024-01-29T16:45:00Z",
    runningBalance: 5342.51
  },
  // Account 2 (John's Savings) transactions
  {
    id: "txn:6",
    accountId: "account:2",
    amount: 200.00,
    type: "TRANSFER_IN",
    status: "COMPLETED",
    description: "Transfer from Checking",
    merchantName: null,
    category: "TRANSFER",
    timestamp: "2024-01-25T14:30:00Z",
    runningBalance: 25000.00
  },
  {
    id: "txn:7",
    accountId: "account:2",
    amount: 93.75,
    type: "INTEREST",
    status: "COMPLETED",
    description: "Monthly Interest Payment",
    merchantName: null,
    category: "INCOME",
    timestamp: "2024-01-31T00:00:00Z",
    runningBalance: 25093.75
  },
  // Account 3 (Jane's Checking) transactions
  {
    id: "txn:8",
    accountId: "account:3",
    amount: -350.00,
    type: "DEBIT",
    status: "COMPLETED",
    description: "Electric Company",
    merchantName: "ConEd",
    category: "UTILITIES",
    timestamp: "2024-01-28T08:00:00Z",
    runningBalance: 12750.25
  },
  {
    id: "txn:9",
    accountId: "account:3",
    amount: -65.50,
    type: "DEBIT",
    status: "COMPLETED",
    description: "Uber",
    merchantName: "Uber",
    category: "TRANSPORTATION",
    timestamp: "2024-01-27T22:15:00Z",
    runningBalance: 13100.25
  },
  {
    id: "txn:10",
    accountId: "account:3",
    amount: -125.00,
    type: "DEBIT",
    status: "COMPLETED",
    description: "Restaurant - The Cheesecake Factory",
    merchantName: "Cheesecake Factory",
    category: "DINING",
    timestamp: "2024-01-26T19:30:00Z",
    runningBalance: 13165.75
  },
  {
    id: "txn:11",
    accountId: "account:3",
    amount: 5000.00,
    type: "CREDIT",
    status: "COMPLETED",
    description: "Payroll Deposit - Tech Corp",
    merchantName: "Tech Corp",
    category: "INCOME",
    timestamp: "2024-01-25T09:00:00Z",
    runningBalance: 13290.75
  },
  {
    id: "txn:12",
    accountId: "account:3",
    amount: -29.99,
    type: "FEE",
    status: "COMPLETED",
    description: "Monthly Service Fee",
    merchantName: null,
    category: "OTHER",
    timestamp: "2024-01-01T00:00:00Z",
    runningBalance: 8290.75
  },
  // Account 4 (Jane's Savings) transactions
  {
    id: "txn:13",
    accountId: "account:4",
    amount: 1000.00,
    type: "TRANSFER_IN",
    status: "COMPLETED",
    description: "Transfer from Checking",
    merchantName: null,
    category: "TRANSFER",
    timestamp: "2024-01-20T10:00:00Z",
    runningBalance: 50000.00
  },
  {
    id: "txn:14",
    accountId: "account:4",
    amount: 197.92,
    type: "INTEREST",
    status: "COMPLETED",
    description: "Monthly Interest Payment",
    merchantName: null,
    category: "INCOME",
    timestamp: "2024-01-31T00:00:00Z",
    runningBalance: 50197.92
  },
  // Account 5 (Jane's Money Market) transactions
  {
    id: "txn:15",
    accountId: "account:5",
    amount: 312.50,
    type: "INTEREST",
    status: "COMPLETED",
    description: "Monthly Interest Payment",
    merchantName: null,
    category: "INCOME",
    timestamp: "2024-01-31T00:00:00Z",
    runningBalance: 75312.50
  },
  // Account 6 (Bob's Checking) transactions
  {
    id: "txn:16",
    accountId: "account:6",
    amount: -75.00,
    type: "DEBIT",
    status: "COMPLETED",
    description: "Gas Station",
    merchantName: "Shell",
    category: "TRANSPORTATION",
    timestamp: "2024-01-28T15:00:00Z",
    runningBalance: 1250.75
  },
  {
    id: "txn:17",
    accountId: "account:6",
    amount: -250.00,
    type: "DEBIT",
    status: "COMPLETED",
    description: "CVS Pharmacy",
    merchantName: "CVS",
    category: "HEALTHCARE",
    timestamp: "2024-01-27T11:30:00Z",
    runningBalance: 1325.75
  },
  {
    id: "txn:18",
    accountId: "account:6",
    amount: 1500.00,
    type: "CREDIT",
    status: "COMPLETED",
    description: "Direct Deposit",
    merchantName: "Employer Inc",
    category: "INCOME",
    timestamp: "2024-01-25T09:00:00Z",
    runningBalance: 1575.75
  },
  {
    id: "txn:19",
    accountId: "account:6",
    amount: -50.00,
    type: "DEBIT",
    status: "PENDING",
    description: "Restaurant",
    merchantName: "Local Diner",
    category: "DINING",
    timestamp: "2024-01-29T13:00:00Z",
    runningBalance: 1200.75
  },
  {
    id: "txn:20",
    accountId: "account:6",
    amount: -15.00,
    type: "FEE",
    status: "COMPLETED",
    description: "ATM Fee - Out of Network",
    merchantName: null,
    category: "OTHER",
    timestamp: "2024-01-24T20:00:00Z",
    runningBalance: 75.75
  }
];

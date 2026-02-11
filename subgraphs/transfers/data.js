export const TRANSFERS = [
  // Internal transfer - John's checking to savings (completed)
  {
    id: "transfer:1",
    fromAccountId: "account:1",
    toAccountId: "account:2",
    toExternalAccount: null,
    amount: 500.00,
    status: "COMPLETED",
    scheduledDate: null,
    completedDate: "2024-01-20T10:30:00Z",
    memo: "Monthly savings contribution",
    createdAt: "2024-01-20T10:30:00Z"
  },
  // Internal transfer - Jane's checking to savings (completed)
  {
    id: "transfer:2",
    fromAccountId: "account:3",
    toAccountId: "account:4",
    toExternalAccount: null,
    amount: 1000.00,
    status: "COMPLETED",
    scheduledDate: null,
    completedDate: "2024-01-18T14:00:00Z",
    memo: "Emergency fund deposit",
    createdAt: "2024-01-18T14:00:00Z"
  },
  // Internal transfer - Jane's savings to money market (pending)
  {
    id: "transfer:3",
    fromAccountId: "account:4",
    toAccountId: "account:5",
    toExternalAccount: null,
    amount: 5000.00,
    status: "PENDING",
    scheduledDate: null,
    completedDate: null,
    memo: "Move to higher yield account",
    createdAt: "2024-01-29T09:00:00Z"
  },
  // Scheduled internal transfer - John's checking to savings
  {
    id: "transfer:4",
    fromAccountId: "account:1",
    toAccountId: "account:2",
    toExternalAccount: null,
    amount: 200.00,
    status: "SCHEDULED",
    scheduledDate: "2024-02-01T10:00:00Z",
    completedDate: null,
    memo: "Recurring savings transfer",
    createdAt: "2024-01-15T10:00:00Z"
  },
  // External transfer - John's checking to external account (completed)
  {
    id: "transfer:5",
    fromAccountId: "account:1",
    toAccountId: null,
    toExternalAccount: {
      bankName: "Chase Bank",
      routingNumber: "****6789",
      accountNumber: "****4321",
      accountHolderName: "John Smith Jr."
    },
    amount: 250.00,
    status: "COMPLETED",
    scheduledDate: null,
    completedDate: "2024-01-22T11:00:00Z",
    memo: "Gift to family",
    createdAt: "2024-01-22T11:00:00Z"
  },
  // Failed transfer example
  {
    id: "transfer:6",
    fromAccountId: "account:6",
    toAccountId: null,
    toExternalAccount: {
      bankName: "Bank of America",
      routingNumber: "****1234",
      accountNumber: "****9999",
      accountHolderName: "Invalid Account"
    },
    amount: 100.00,
    status: "FAILED",
    scheduledDate: null,
    completedDate: null,
    memo: "Test transfer",
    createdAt: "2024-01-25T15:00:00Z"
  },
  // Cancelled transfer
  {
    id: "transfer:7",
    fromAccountId: "account:3",
    toAccountId: "account:6",
    toExternalAccount: null,
    amount: 50.00,
    status: "CANCELLED",
    scheduledDate: "2024-01-30T10:00:00Z",
    completedDate: null,
    memo: "Cancelled by user",
    createdAt: "2024-01-24T10:00:00Z"
  }
];

// Keep track of transfer ID for new transfers
let nextTransferId = 8;

export const getNextTransferId = () => {
  return `transfer:${nextTransferId++}`;
};

import { TRANSFERS, getNextTransferId } from "./data.js";
import { GraphQLError } from "graphql";

const getTransferById = (id) => TRANSFERS.find((it) => it.id === id);
const getPendingTransfers = () => TRANSFERS.filter((it) => 
  it.status === "PENDING" || it.status === "SCHEDULED"
);

export const resolvers = {
  Query: {
    transfer: (_, { id }) => getTransferById(id),
    pendingTransfers: () => getPendingTransfers()
  },
  Mutation: {
    initiateTransfer(_, { input }) {
      const { fromAccountId, toAccountId, toExternalAccount, amount, scheduledDate, memo } = input;

      // Validate that either toAccountId or toExternalAccount is provided
      if (!toAccountId && !toExternalAccount) {
        throw new GraphQLError("Either toAccountId or toExternalAccount must be provided");
      }

      if (toAccountId && toExternalAccount) {
        throw new GraphQLError("Cannot specify both toAccountId and toExternalAccount");
      }

      if (amount <= 0) {
        throw new GraphQLError("Transfer amount must be greater than zero");
      }

      const newTransfer = {
        id: getNextTransferId(),
        fromAccountId,
        toAccountId: toAccountId || null,
        toExternalAccount: toExternalAccount || null,
        amount,
        status: scheduledDate ? "SCHEDULED" : "PENDING",
        scheduledDate: scheduledDate || null,
        completedDate: null,
        memo: memo || null,
        createdAt: new Date().toISOString()
      };

      TRANSFERS.push(newTransfer);
      return newTransfer;
    },
    cancelTransfer(_, { id }) {
      const transfer = getTransferById(id);

      if (!transfer) {
        throw new GraphQLError("Transfer not found");
      }

      if (transfer.status === "COMPLETED") {
        throw new GraphQLError("Cannot cancel a completed transfer");
      }

      if (transfer.status === "CANCELLED") {
        throw new GraphQLError("Transfer is already cancelled");
      }

      if (transfer.status === "FAILED") {
        throw new GraphQLError("Cannot cancel a failed transfer");
      }

      transfer.status = "CANCELLED";
      return transfer;
    }
  },
  Transfer: {
    __resolveReference(ref) {
      return getTransferById(ref.id);
    },
    fromAccount(transfer) {
      return { id: transfer.fromAccountId };
    },
    toAccount(transfer) {
      if (!transfer.toAccountId) return null;
      return { id: transfer.toAccountId };
    }
  }
};

import mongoose from "mongoose";
import { z } from "zod";

export const ticketTransactionDTO = z.object({
  eventId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId format"
  }),
  nTickets: z
    .number()
    .positive({ message: "Number of tickets must be positive" })
    .min(1, { message: "Must purchase at least 1 ticket" })
});

export type TicketTransactionDTO = z.infer<typeof ticketTransactionDTO>;

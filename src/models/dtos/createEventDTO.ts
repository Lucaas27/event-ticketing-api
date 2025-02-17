import { z } from "zod";

export const createEventDTO = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format")
    .transform((dateStr) => {
      const [day, month, year] = dateStr.split("/");
      const parsedDate = new Date(+year, +month - 1, +day);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date");
      }
      return parsedDate;
    }),
  capacity: z.number().positive("Capacity must be greater than 0"),
  costPerTicket: z.number().positive("Cost per ticket must be greater than 0"),
  availableTickets: z.number().positive("Cost per ticket must be greater than 0").optional()
});

export type CreateEventDTO = z.infer<typeof createEventDTO>;

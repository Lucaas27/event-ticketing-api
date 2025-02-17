import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  name: string;
  date: string;
  capacity: number;
  costPerTicket: number;
  availableTickets: number;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    date: {
      type: String,
      required: true,
      unique: true // Ensures only one event per day
    },
    capacity: { type: Number, required: true },
    costPerTicket: { type: Number, required: true },
    availableTickets: { type: Number }
  },
  { timestamps: true }
);

// Pre-save middleware to set initial available tickets
eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.availableTickets = this.capacity;
  }
  next();
});

export const EventModel = mongoose.model<IEvent>("Event", eventSchema);

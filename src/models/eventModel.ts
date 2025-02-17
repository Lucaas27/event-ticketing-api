import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  name: string;
  date: string | Date;
  capacity: number;
  costPerTicket: number;
  availableTickets: number;
  soldTickets: number;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    date: {
      type: Date,
      required: true,
      unique: true // Ensures only one event per day
    },
    capacity: { type: Number, required: true },
    costPerTicket: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    soldTickets: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

// Pre-save middleware to set initial values and maintain consistency
eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.availableTickets = this.capacity;
    this.soldTickets = 0;
  } else {
    // Ensure soldTickets is always correctly calculated
    this.soldTickets = this.capacity - this.availableTickets;
  }
  next();
});

export const EventModel = mongoose.model<IEvent>("Event", eventSchema);

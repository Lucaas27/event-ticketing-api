import { Router } from "express";

export interface Event {
  id: string;
  name: string;
  date: Date;
  location: string;
  capacity: number;
  ticketsSold: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: Date;
  quantity: number;
}

export interface Stats {
  totalTicketsSold: number;
  totalRevenue: number;
  eventId: string;
}

export interface IBaseRouter {
  setupRoutes(): Router;
}

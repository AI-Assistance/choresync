import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  avatarColor: text("avatar_color").notNull(), // Hex color for avatar background
  householdId: integer("household_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  avatarColor: true,
});

// Households table
export const households = pgTable("households", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdById: integer("created_by_id").notNull(),
});

export const insertHouseholdSchema = createInsertSchema(households).pick({
  name: true,
  createdById: true,
});

// Chores table
export const chores = pgTable("chores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  householdId: integer("household_id").notNull(),
  assignedToId: integer("assigned_to_id"),
  dueDate: timestamp("due_date").notNull(),
  repeatFrequency: text("repeat_frequency").notNull(), // none, daily, weekly, biweekly, monthly
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  completedById: integer("completed_by_id"),
});

export const insertChoreSchema = createInsertSchema(chores).pick({
  name: true,
  description: true,
  category: true,
  estimatedMinutes: true,
  householdId: true,
  assignedToId: true,
  dueDate: true,
  repeatFrequency: true,
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // chore_due, chore_completed, chore_assigned, etc.
  message: text("message").notNull(),
  choreId: integer("chore_id"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  message: true,
  choreId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Household = typeof households.$inferSelect;
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;

export type Chore = typeof chores.$inferSelect;
export type InsertChore = z.infer<typeof insertChoreSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Additional validation schemas for forms
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const choreCategoryEnum = [
  "Kitchen",
  "Bathroom",
  "Living Room",
  "Bedroom",
  "General",
  "Outdoors",
  "Other"
] as const;

export const choreFrequencyEnum = [
  "Never",
  "Daily", 
  "Weekly", 
  "Biweekly", 
  "Monthly"
] as const;

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const assistantsTable = pgTable('assistants', {
  id: uuid('id').primaryKey(),
  user_id: uuid('user_id').notNull(),
  assistant_name: text('assistant_name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export type InsertAssistant = typeof assistantsTable.$inferInsert;
export type SelectAssistant = typeof assistantsTable.$inferSelect;

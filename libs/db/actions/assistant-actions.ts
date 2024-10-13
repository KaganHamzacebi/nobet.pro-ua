'use server';

import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { assistantsTable, SelectAssistant } from '../schema';

export const getAssistants = async (userId: SelectAssistant['user_id']) => {
  return db.select().from(assistantsTable).where(eq(assistantsTable.user_id, userId));
};

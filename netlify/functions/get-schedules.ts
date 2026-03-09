import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { schedules } from '../../src/db/schema';
import { desc } from 'drizzle-orm';

export const handler: Handler = async (event, context) => {
    try {
        const allSchedules = await db.select().from(schedules).orderBy(desc(schedules.startTime));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allSchedules),
        };
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch schedules' }),
        };
    }
};

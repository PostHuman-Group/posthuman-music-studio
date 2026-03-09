import { db } from '../../src/db';
import { samples } from '../../src/db/schema';
import { desc } from 'drizzle-orm';

export const handler = async (event: any) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const allSamples = await db.select()
            .from(samples)
            .orderBy(desc(samples.createdAt));

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ samples: allSamples }),
        };
    } catch (error: any) {
        console.error('Error fetching samples:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

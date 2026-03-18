import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { samples } from '../../src/db/schema';
import { desc, count } from 'drizzle-orm';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { 
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        const [allSamples, total] = await Promise.all([
            db.select().from(samples).orderBy(desc(samples.createdAt)),
            db.select({ value: count() }).from(samples)
        ]);

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ 
                data: allSamples, 
                meta: { total: total[0].value, timestamp: new Date().toISOString() } 
            }),
        };
    } catch (error: unknown) {
        const err = error as Error;
        console.error('[get-samples] Critical Error:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Internal Server Error', 
                message: err.message,
                traceId: event.headers['x-nf-request-id'] || 'unknown'
            }),
        };
    }
};

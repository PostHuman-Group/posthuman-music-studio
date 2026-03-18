import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { assets } from '../../src/db/schema';
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
        const [allAssets, total] = await Promise.all([
            db.select().from(assets).orderBy(desc(assets.createdAt)),
            db.select({ value: count() }).from(assets)
        ]);

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ 
                data: allAssets, 
                meta: { total: total[0].value, timestamp: new Date().toISOString() } 
            }),
        };
    } catch (error: unknown) {
        const err = error as Error;
        console.error('[get-assets] Critical Error:', err);
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

import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { streamState } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { 
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        const result = await db.select().from(streamState).where(eq(streamState.id, 'GLOBAL')).limit(1);
        
        if (result.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Stream state not found' })
            };
        }

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                data: result[0],
                meta: {
                    timestamp: new Date().toISOString()
                }
            })
        };
    } catch (error) {
        console.error('Error fetching stream state:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to fetch stream state' })
        };
    }
};

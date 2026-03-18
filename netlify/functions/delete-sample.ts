import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { samples } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        return { 
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { id } = body;

        if (!id) {
            return { 
                statusCode: 400, 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing required field: id' }) 
            };
        }

        const deleteResult = await db.delete(samples).where(eq(samples.id, id)).returning();

        if (deleteResult.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Sample not found' }),
            };
        }

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ 
                success: true,
                message: 'Sample deleted successfully',
                data: deleteResult[0]
            }),
        };
    } catch (error: unknown) {
        const err = error as Error;
        console.error('[delete-sample] Critical Error:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Internal Server Error', 
                message: err.message 
            }),
        };
    }
};

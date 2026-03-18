import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { assets } from '../../src/db/schema';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { type, prompt, url } = body;

        if (!type || !prompt || !url) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing required fields: type, prompt, url' }),
            };
        }

        const [newAsset] = await db.insert(assets).values({
            type,
            prompt,
            url,
            status: 'ready',
        }).returning();

        return {
            statusCode: 201,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ 
                data: newAsset,
                message: 'Asset saved successfully' 
            }),
        };
    } catch (error: unknown) {
        const err = error as Error;
        console.error('[save-asset] Critical Error:', err);
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

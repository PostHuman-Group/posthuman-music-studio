import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { streamState } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

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
        const { genre, gain, complexity, backgroundUrl, backgroundType } = body;

        const updateData: any = {
            updatedAt: new Date()
        };

        if (genre !== undefined) updateData.genre = genre;
        if (gain !== undefined) updateData.gain = gain;
        if (complexity !== undefined) updateData.complexity = complexity;
        if (backgroundUrl !== undefined) updateData.backgroundUrl = backgroundUrl;
        if (backgroundType !== undefined) updateData.backgroundType = backgroundType;

        const result = await db.update(streamState)
            .set(updateData)
            .where(eq(streamState.id, 'GLOBAL'))
            .returning();

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                data: result[0],
                message: 'Stream state updated successfully'
            })
        };
    } catch (error) {
        console.error('Error updating stream state:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to update stream state' })
        };
    }
};

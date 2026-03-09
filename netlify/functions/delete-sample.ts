import { db } from '../../src/db';
import { samples } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export const handler = async (event: any) => {
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { id } = JSON.parse(event.body || '{}');

    if (!id) {
        return { statusCode: 400, body: 'Missing sample ID' };
    }

    try {
        await db.delete(samples).where(eq(samples.id, id));

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error: any) {
        console.error('Error deleting sample:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

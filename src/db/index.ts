import { neon as neonNetlify } from '@netlify/neon';
import { neon as neonServerless } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const getSql = () => {
    // Use @netlify/neon if in Netlify environment (handles NETLIFY_DATABASE_URL automatically)
    if (process.env.NETLIFY === 'true' || process.env.NETLIFY === '1') {
        return neonNetlify();
    }
    // Fallback to standard serverless driver for local dev
    return neonServerless(process.env.DATABASE_URL!);
};

export const db = drizzle(getSql(), { schema });

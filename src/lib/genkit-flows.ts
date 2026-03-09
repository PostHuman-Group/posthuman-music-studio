import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';
import { ai } from '../../genkit-config';

export const streamMetadataFlow = ai.defineFlow(
    {
        name: 'streamMetadataFlow',
        inputSchema: z.object({ theme: z.string() }) as any,
        outputSchema: z.object({
            title: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
        }) as any,
    },
    async (input) => {
        const response = await ai.generate({
            model: gemini15Flash,
            prompt: `Generate creative YouTube livestream metadata for a music channel with the theme: ${input.theme}. Provide title, description, and tags.`,
        });

        return {
            title: `PostHuman Radio: ${input.theme} Edition`,
            description: response.text,
            tags: ['ai-music', 'posthuman', input.theme],
        };
    }
);

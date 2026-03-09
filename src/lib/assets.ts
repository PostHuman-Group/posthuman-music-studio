import { z } from 'genkit';
import { ai } from '../../genkit-config';
import { db } from '../db';
import { assets, samples } from '../db/schema';

export const imageGenerationFlow = ai.defineFlow(
    {
        name: 'imageGenerationFlow',
        inputSchema: z.object({
            theme: z.string(),
            count: z.number().optional().default(1),
        }),
        outputSchema: z.object({
            assets: z.array(z.object({
                url: z.string(),
                prompt: z.string(),
            })),
        }),
    },
    async (input) => {
        // 1. Generate optimized Imagen prompts using Gemini
        const { text } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: `You are an expert prompt engineer for Imagen.
            Generate ${input.count} highly detailed and cinematic prompts for a 24/7 music radio stream background.
            The theme is: "${input.theme}".
            Style: PostHuman future-tech, midnight indigo aesthetic, cinematic lighting, ultra-wide.
            Return exactly ${input.count} prompts, one per line.`,
        });

        const prompts = text.split('\n').filter(p => p.trim().length > 0);

        // 2. Mock Imagen generation for now (to be replaced with actual Imagen integration)
        const generatedAssets = await Promise.all(prompts.map(async (prompt) => {
            const url = `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 10))}/1920/1080`;

            // 3. Save to Neon DB
            const [newAsset] = await db.insert(assets).values({
                type: 'image',
                prompt: prompt,
                url: url,
                status: 'ready',
            }).returning();

            return {
                url: newAsset.url,
                prompt: newAsset.prompt,
            };
        }));

        return { assets: generatedAssets };
    }
);

export const videoGenerationFlow = ai.defineFlow(
    {
        name: 'videoGenerationFlow',
        inputSchema: z.object({
            theme: z.string(),
            count: z.number().optional().default(1),
        }),
        outputSchema: z.object({
            assets: z.array(z.object({
                url: z.string(),
                prompt: z.string(),
            })),
        }),
    },
    async (input) => {
        // 1. Generate optimized Video prompts using Gemini
        const { text } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: `You are an expert prompt engineer for AI Video Generators (like Runway or Sora).
            Generate ${input.count} descriptions for seamless looping video backgrounds for a 24/7 music stream.
            The theme is: "${input.theme}".
            Style: PostHuman future-tech, midnight indigo aesthetic, cinematic lighting, slow camera pans or subtle motion.
            The video MUST be loopable.
            Return exactly ${input.count} looping descriptions, one per line.`,
        });

        const prompts = text.split('\n').filter(p => p.trim().length > 0);

        // 2. Mock Video generation for now (using placeholder video services)
        const generatedAssets = await Promise.all(prompts.map(async (prompt) => {
            // Using a placeholder video service or random seed for visualization
            const url = `https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-bright-neon-lights-44534-preview.mp4`;

            // 3. Save to Neon DB
            const [newAsset] = await db.insert(assets).values({
                type: 'video',
                prompt: prompt,
                url: url,
                status: 'ready',
            }).returning();

            return {
                url: newAsset.url,
                prompt: newAsset.prompt,
            };
        }));

        return { assets: generatedAssets };
    }
);

export const sampleGenerationFlow = ai.defineFlow(
    {
        name: 'sampleGenerationFlow',
        inputSchema: z.object({
            prompt: z.string(),
        }),
        outputSchema: z.object({
            sample: z.object({
                id: z.string(),
                name: z.string(),
                theme: z.string(),
                duration: z.string(),
                type: z.string(),
                createdAt: z.string(),
            }),
        }),
    },
    async (input) => {
        // 1. Generate sample metadata using Gemini
        const { text: name } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: `Generate a short, cool names (max 2 words) for a musical sample/loop based on this prompt: "${input.prompt}". 
            Style: PostHuman, Cyberpunk, Futuristic. 
            Return ONLY the name.`,
        });

        const sampleType = input.prompt.toLowerCase().includes('drum') ? 'drum' :
            input.prompt.toLowerCase().includes('vocal') ? 'vocal' :
                input.prompt.toLowerCase().includes('synth') ? 'synth' : 'loop';

        // 2. Mock asset URL (In production this would call a Music AI model)
        const url = `https://storage.googleapis.com/posthuman-samples/mock-sample-${Math.random().toString(36).slice(2)}.mp3`;

        // 3. Save to Neon DB
        const [newSample] = await db.insert(samples).values({
            name: name.trim(),
            prompt: input.prompt,
            url: url,
            type: sampleType,
            theme: input.prompt,
            duration: '0:30',
        }).returning();

        return {
            sample: {
                id: newSample.id,
                name: newSample.name,
                theme: newSample.theme || '',
                duration: newSample.duration || '0:00',
                type: newSample.type || 'loop',
                createdAt: new Date().toISOString(),
            }
        };
    }
);

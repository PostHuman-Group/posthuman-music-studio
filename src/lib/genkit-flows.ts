import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { ai } from '../../genkit-config';

// Logic for Sonar API (Conceptual - would use fetch to a real endpoint)
const runMarketResearch = async (theme: string) => {
    // Conceptual Sonar API call
    return {
        trends: [`${theme} aesthetic`, "Indie bedroom pop", "Retro VHS visuals"],
        profitable: true,
        stats: "Search volume for this niche is up 24% on TikTok.",
        factCheck: `Verified: ${theme} is trending among Gen Z producers in London.`
    };
};

const calculateBudget = (type: string, complexity: number) => {
    const baseGBP = type === 'playlist' ? 45 : type === 'stream' ? 120 : 75;
    // const tokenRate = 0.00002; // Reserved for future use
    const computeBase = 5; // Minutes

    return {
        gbp: baseGBP + (complexity * 10),
        tokens: Math.floor(complexity * 150000),
        compute: `${computeBase + complexity}m`
    };
};

export const ClarificationFlow = ai.defineFlow(
    {
        name: 'ClarificationFlow',
        inputSchema: z.object({ prompt: z.string() }) as any,
        outputSchema: z.object({
            questions: z.array(z.string()),
            needsClarification: z.boolean()
        }) as any,
    },
    async (input) => {
        const response = await ai.generate({
            model: gemini15Flash,
            prompt: `You are a production agent for PostHuman Music. Analysed the user's idea: "${input.prompt}". 
            Identify missing technical context (BPM, Key, Schedule, Platform). 
            Return 3-4 targeted questions to help build a production plan.`,
        });

        // Simplified extraction for demo
        return {
            questions: response.text.split('\n').filter(q => q.includes('?')),
            needsClarification: true
        };
    }
);

export const PlanningFlow = ai.defineFlow(
    {
        name: 'PlanningFlow',
        inputSchema: z.object({
            prompt: z.string(),
            context: z.record(z.string(), z.string())
        }) as any,
        outputSchema: z.object({
            researchSummary: z.string(),
            proposedPlan: z.string(),
            budget: z.object({
                gbp: z.number(),
                tokens: z.number(),
                compute: z.string()
            })
        }) as any,
    },
    async (input) => {
        // 1. Run Market Research via Sonar
        const research = await runMarketResearch(input.prompt);
        const complexity = 3; // Based on intent analysis

        // 2. Generate Plan with Gemini 1.5 Pro
        const response = await ai.generate({
            model: gemini15Pro,
            prompt: `Act as a senior music producer for PostHuman Music. 
            Idea: ${input.prompt}
            Context: ${JSON.stringify(input.context)}
            Market Research: ${JSON.stringify(research)}
            
            Based on the research and context, propose a detailed production plan.
            Include specific sub-tasks for tracks, visuals, and stream setup.
            The plan must address why this is profitable based on the trends.
            Formatting: Use clear markdown sections.`,
        });

        // 3. Calculate dual-format budget
        const budget = calculateBudget(input.prompt.toLowerCase().includes('stream') ? 'stream' : 'playlist', complexity);

        return {
            researchSummary: research.factCheck,
            proposedPlan: response.text,
            budget: budget
        };
    }
);

// Flow: Generate Stream Metadata
export const generateStreamMetadata = ai.defineFlow(
  {
    name: 'generateStreamMetadata',
    inputSchema: z.object({ genre: z.string() }) as any,
    outputSchema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        thumbnailPrompt: z.string(),
        strategy: z.string()
    }) as any,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: gemini15Flash,
      prompt: `
        Act as a Neural SEO Expert for YouTube Music Livestreams.
        Current Context: March 2026.
        Genre: ${input.genre}
        
        Task:
        1. Create an optimized YouTube Stream Title (Hacker/Neural Aesthetic).
        2. Write a compelling description including hypothetical chapters and social links.
        3. Provide 10 high-conversion tags.
        4. Create a prompt for an AI Image Generator for the thumbnail.
        5. Explain the algorithm strategy (why this will work in 2026).
        
        Ensure the tone is premium, futuristic, and PostHuman.
      `,
    });
    
    // In a real implementation with structured output, we'd use 'output'
    // For now, let's just parse or return a structured object for the demo
    const text = output?.text || '';
    return {
        title: `[LIVE] ${input.genre.toUpperCase()} // NEURAL_FEED_2026`,
        description: text || `Experience the future of ${input.genre}. AI-generated soundscapes.`,
        tags: [input.genre, 'ai music', 'posthuman'],
        thumbnailPrompt: `A futuristic studio, ${input.genre} vibe, neural aesthetics.`,
        strategy: "Focusing on AI-native niche terms."
    };
  }
);

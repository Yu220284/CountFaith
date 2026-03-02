'use server';
/**
 * @fileOverview An AI chat guide for rally participants that provides contextual information, storytelling, and assistance.
 *
 * - provideRallyChatGuidance - A function that handles the AI chat guidance process.
 * - ProvideRallyChatGuidanceInput - The input type for the provideRallyChatGuidance function.
 * - ProvideRallyChatGuidanceOutput - The return type for the provideRallyChatGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideRallyChatGuidanceInputSchema = z.object({
  userQuery: z.string().describe("The user's question or statement to the AI chat guide."),
  currentLocation: z.string().optional().describe("The participant's current location."),
  nextSpotName: z.string().optional().describe("The name of the next spot in the rally."),
  rallyTheme: z.string().optional().describe("The overall theme of the rally (e.g., mystery, VTuber, history)."),
  rallyStoryContext: z.string().optional().describe("Any relevant storytelling elements or historical facts for the current stage of the rally."),
});
export type ProvideRallyChatGuidanceInput = z.infer<typeof ProvideRallyChatGuidanceInputSchema>;

const ProvideRallyChatGuidanceOutputSchema = z.object({
  response: z.string().describe("The AI chat guide's response to the user."),
});
export type ProvideRallyChatGuidanceOutput = z.infer<typeof ProvideRallyChatGuidanceOutputSchema>;

export async function provideRallyChatGuidance(
  input: ProvideRallyChatGuidanceInput
): Promise<ProvideRallyChatGuidanceOutput> {
  return provideRallyChatGuidanceFlow(input);
}

const rallyChatGuidePrompt = ai.definePrompt({
  name: 'rallyChatGuidePrompt',
  input: {schema: ProvideRallyChatGuidanceInputSchema},
  output: {schema: ProvideRallyChatGuidanceOutputSchema},
  prompt: `You are a friendly and knowledgeable AI chat guide for the PRA.net stamp rally, embodying the spirit of the rally's character and theme. Your role is to provide contextual tourist information, engage in storytelling, and offer guidance to participants, especially if they are lost or need help finding the next spot.

Rally Theme: {{{rallyTheme}}}
Current Location: {{{currentLocation}}}
Next Rally Spot: {{{nextSpotName}}}
Rally Story Context: {{{rallyStoryContext}}}

User Query: {{{userQuery}}}

Based on the information above, respond to the user in a helpful and engaging manner. If the user seems lost, provide clear and concise directions or hints to the next spot. Keep your responses consistent with the rally's theme and character.`,
});

const provideRallyChatGuidanceFlow = ai.defineFlow(
  {
    name: 'provideRallyChatGuidanceFlow',
    inputSchema: ProvideRallyChatGuidanceInputSchema,
    outputSchema: ProvideRallyChatGuidanceOutputSchema,
  },
  async input => {
    const {output} = await rallyChatGuidePrompt(input);
    return output!;
  }
);

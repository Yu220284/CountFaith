'use server';
/**
 * @fileOverview An AI agent that generates descriptive text or engaging questions for each rally spot.
 *
 * - generateSpotContent - A function that handles the content generation process for rally spots.
 * - GenerateSpotContentInput - The input type for the generateSpotContent function.
 * - GenerateSpotContentOutput - The return type for the generateSpotContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpotContentInputSchema = z.object({
  rallyTheme: z
    .string()
    .describe(
      'The chosen theme of the stamp rally (e.g., mystery, VTuber, history).'
    ),
  spotDetails: z
    .array(
      z.object({
        spotName: z.string().describe('The name of the rally spot.'),
        description:
          z.string().describe('An existing description of the rally spot.'),
        location:
          z.string().describe('The location details of the rally spot (e.g., address, coordinates).'),
      })
    )
    .describe('A list of rally spots with their details.'),
});
export type GenerateSpotContentInput = z.infer<
  typeof GenerateSpotContentInputSchema
>;

const GenerateSpotContentOutputSchema = z.object({
  spotContents: z
    .array(
      z.object({
        spotName: z.string().describe('The name of the rally spot.'),
        generatedContent:
          z.string().describe('The AI-generated descriptive text or engaging question for the spot.'),
      })
    )
    .describe('A list of rally spots with their AI-generated content.'),
});
export type GenerateSpotContentOutput = z.infer<
  typeof GenerateSpotContentOutputSchema
>;

export async function generateSpotContent(
  input: GenerateSpotContentInput
): Promise<GenerateSpotContentOutput> {
  return generateSpotContentFlow(input);
}

const generateSpotContentPrompt = ai.definePrompt({
  name: 'generateSpotContentPrompt',
  input: {schema: GenerateSpotContentInputSchema},
  output: {schema: GenerateSpotContentOutputSchema},
  prompt: `You are an expert content creator for stamp rallies. Your task is to generate unique and engaging content for each rally spot, tailored to a specific rally theme.

For each spot, you should generate either a descriptive text that highlights its key features in relation to the rally theme, or an engaging question that prompts participants to interact with the spot or its history. The choice between descriptive text and a question should be made to best suit the spot and the theme, aiming for variety and engagement across all spots.

Provide the output as a JSON array where each object corresponds to a rally spot and has a 'spotName' and 'generatedContent' field.

Rally Theme: {{{rallyTheme}}}

Here are the rally spots:
{{#each spotDetails}}
- Spot Name: {{{spotName}}}
  Description: {{{description}}}
  Location: {{{location}}}
{{/each}}`,
});

const generateSpotContentFlow = ai.defineFlow(
  {
    name: 'generateSpotContentFlow',
    inputSchema: GenerateSpotContentInputSchema,
    outputSchema: GenerateSpotContentOutputSchema,
  },
  async input => {
    const {output} = await generateSpotContentPrompt(input);
    return output!;
  }
);

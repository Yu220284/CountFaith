'use server';
/**
 * @fileOverview A Genkit flow that generates an optimal stamp rally route based on user criteria.
 *
 * - generateRallyRoute - A function that handles the rally route generation process.
 * - GenerateRallyRouteInput - The input type for the generateRallyRoute function.
 * - GenerateRallyRouteOutput - The return type for the generateRallyRoute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRallyRouteInputSchema = z.object({
  location: z
    .string()
    .describe('The geographical location for the rally (e.g., "Shinjuku, Tokyo").'),
  theme: z
    .string()
    .describe(
      'The theme or concept of the rally (e.g., "mystery", "VTuber history", "local food tour").'
    ),
  durationHours: z
    .number()
    .int()
    .min(1)
    .max(12)
    .describe('The desired total duration of the rally in hours (e.g., 3).'),
});
export type GenerateRallyRouteInput = z.infer<typeof GenerateRallyRouteInputSchema>;

const RallySpotSchema = z.object({
  name: z.string().describe('The name of the point of interest.'),
  description: z
    .string()
    .describe('A brief description of the spot, relevant to the rally theme.'),
  estimatedActivityMinutes: z
    .number()
    .int()
    .min(5)
    .describe('The estimated time a participant will spend at this spot in minutes.'),
  walkingDistanceToNextSpotMeters: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('The estimated walking distance from this spot to the next spot in meters. This field should not be present for the last spot.'),
});

const GenerateRallyRouteOutputSchema = z.object({
  rallyName: z.string().describe('A suggested name for the stamp rally.'),
  description: z.string().describe('A brief overview description of the generated rally route.'),
  spots: z
    .array(RallySpotSchema)
    .min(5)
    .max(7)
    .describe('An array of 5 to 7 optimal points of interest for the rally.'),
  totalEstimatedMinutes: z
    .number()
    .int()
    .describe('The total estimated time for the entire rally, including activity times at spots and walking.'),
  totalWalkingDistanceMeters: z
    .number()
    .int()
    .describe('The total estimated walking distance for the entire rally.'),
});
export type GenerateRallyRouteOutput = z.infer<typeof GenerateRallyRouteOutputSchema>;

export async function generateRallyRoute(
  input: GenerateRallyRouteInput
): Promise<GenerateRallyRouteOutput> {
  return generateRallyRouteFlow(input);
}

const generateRallyRoutePrompt = ai.definePrompt({
  name: 'generateRallyRoutePrompt',
  input: { schema: GenerateRallyRouteInputSchema },
  output: { schema: GenerateRallyRouteOutputSchema },
  prompt: `You are an expert stamp rally planner. Your task is to create an optimal stamp rally route based on the provided criteria.
The route should consist of between 5 and 7 unique points of interest (spots). For each spot, you must provide:
- A 'name' (string) of the point of interest.
- A 'description' (string) relevant to the rally's theme.
- An 'estimatedActivityMinutes' (integer) for the time a participant will spend at this spot (minimum 5 minutes).
- An optional 'walkingDistanceToNextSpotMeters' (integer) representing the estimated walking distance from this spot to the next spot in meters. This field MUST NOT be present for the final spot in the route.

After listing all spots, calculate and provide the 'totalEstimatedMinutes' for the entire rally (sum of all estimatedActivityMinutes and all walking times converted to minutes based on an average walking speed of 80 meters per minute), and the 'totalWalkingDistanceMeters' for the entire rally (sum of all walking distances).

Consider the 'durationHours' to influence the estimated activity times and overall length.

Location: {{{location}}}
Theme: {{{theme}}}
Desired Total Duration: {{{durationHours}}} hours`,
});

const generateRallyRouteFlow = ai.defineFlow(
  {
    name: 'generateRallyRouteFlow',
    inputSchema: GenerateRallyRouteInputSchema,
    outputSchema: GenerateRallyRouteOutputSchema,
  },
  async (input) => {
    const { output } = await generateRallyRoutePrompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview A Genkit flow for generating draft outreach emails to rally spots
 * and finding their public contact information.
 *
 * - generateOutreachEmail - A function that handles the email and contact info generation process.
 * - GenerateOutreachEmailInput - The input type for the generateOutreachEmail function.
 * - GenerateOutreachEmailOutput - The return type for the generateOutreachEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutreachEmailInputSchema = z.object({
  rallyName: z.string().describe('The name of the stamp rally.'),
  spotName: z.string().describe('The name of the rally spot (e.g., a cafe, museum).'),
  spotAddress: z.string().describe('The full address of the rally spot.'),
  rallyTheme: z.string().describe('The theme or concept of the stamp rally (e.g., mystery, VTuber, history).'),
  organizerName: z.string().describe('The name of the rally organizer.'),
  organizerEmail: z.string().describe('The contact email of the rally organizer.'),
  additionalContext: z.string().optional().describe('Any additional details or specific requests for the collaboration email.'),
});
export type GenerateOutreachEmailInput = z.infer<typeof GenerateOutreachEmailInputSchema>;

const ContactInfoSchema = z.object({
  website: z.string().optional().describe('Public website of the rally spot.'),
  phone: z.string().optional().describe('Public phone number of the rally spot.'),
  email: z.string().optional().describe('Public email address of the rally spot.'),
}).describe('Publicly available contact information for the rally spot.');

const GenerateOutreachEmailOutputSchema = z.object({
  draftEmail: z.string().describe('The generated draft email content.'),
  contactInfo: ContactInfoSchema.optional().describe('Publicly available contact information found for the rally spot.'),
});
export type GenerateOutreachEmailOutput = z.infer<typeof GenerateOutreachEmailOutputSchema>;

// Tool to simulate finding public contact information for a spot.
// In a real application, this would integrate with a third-party API or web scraping service.
const getPublicContactInfoTool = ai.defineTool(
  {
    name: 'getPublicContactInfo',
    description: 'Finds public contact information (website, phone, email) for a given business/spot name and address.',
    inputSchema: z.object({
      spotName: z.string().describe('The name of the business/spot.'),
      spotAddress: z.string().describe('The full address of the business/spot.'),
    }),
    outputSchema: ContactInfoSchema,
  },
  async (input) => {
    console.log(`Mocking contact info lookup for: ${input.spotName} at ${input.spotAddress}`);
    // This is a mock implementation. Replace with actual API calls to find contact info.
    // Example: call Google Places API, a local business directory, or a web scraping service.

    if (input.spotName.toLowerCase().includes('cafe')) {
      return {
        website: 'https://mockcafe.example.com/contact',
        phone: '123-456-7890',
        email: 'info@mockcafe.example.com',
      };
    } else if (input.spotName.toLowerCase().includes('museum')) {
      return {
        website: 'https://mockmuseum.example.org',
        phone: '098-765-4321',
        email: 'contact@mockmuseum.example.org',
      };
    }
    return {}; // No contact info found for other spots
  }
);

const generateOutreachEmailPrompt = ai.definePrompt(
  {
    name: 'generateOutreachEmailPrompt',
    // The tool is not directly used by the prompt here because the flow calls it first.
    // The result is passed as part of the prompt's input.
    input: GenerateOutreachEmailInputSchema.extend({
      foundContactInfo: ContactInfoSchema.optional(), // Pass contact info found by tool
    }),
    output: z.object({ draftEmail: z.string() }), // Prompt only outputs the email text
    prompt: `You are an AI assistant specialized in drafting professional outreach emails for collaboration requests. Your task is to generate a compelling and polite email to a local spot owner, inviting them to participate in a stamp rally.

### Instructions:
- Draft a professional and friendly email to the owner/manager of '{{{spotName}}}' at '{{{spotAddress}}}'.
- The email should introduce the '{{{rallyName}}}' stamp rally, highlighting its theme: '{{{rallyTheme}}}'.
- Clearly explain the benefits of participating (e.g., increased foot traffic, community engagement, local promotion).
- Propose a collaboration, asking if they would be interested in being a 'stamp spot' or offering a small incentive for rally participants.
- Include a clear call to action for them to respond or to arrange a follow-up discussion.
- Mention that you are '{{{organizerName}}}' and your contact email is '{{{organizerEmail}}}'.

### Provided Information:
- Rally Name: {{{rallyName}}}
- Rally Theme: {{{rallyTheme}}}
- Spot Name: {{{spotName}}}
- Spot Address: {{{spotAddress}}}
- Organizer Name: {{{organizerName}}}
- Organizer Email: {{{organizerEmail}}}
{{#if foundContactInfo}}
- We found the following public contact information for '{{{spotName}}}':
  {{#if foundContactInfo.website}}  - Website: {{{foundContactInfo.website}}}
  {{/if}}{{#if foundContactInfo.phone}}  - Phone: {{{foundContactInfo.phone}}}
  {{/if}}{{#if foundContactInfo.email}}  - Email: {{{foundContactInfo.email}}}
  {{/if}}
  Please consider incorporating this information into the email if it helps make it more personalized (e.g., "After visiting your website, we believe..."). If a specific email address was found, you can suggest sending the response there.
{{/if}}

{{#if additionalContext}}
### Additional Context/Requests:
{{{additionalContext}}}
{{/if}}

Start the email directly, no need for a subject line in the draft.`,
  }
);

const generateOutreachEmailFlow = ai.defineFlow(
  {
    name: 'generateOutreachEmailFlow',
    inputSchema: GenerateOutreachEmailInputSchema,
    outputSchema: GenerateOutreachEmailOutputSchema,
  },
  async (input) => {
    // First, try to find public contact information using the defined tool.
    const contactInfo = await getPublicContactInfoTool({
      spotName: input.spotName,
      spotAddress: input.spotAddress,
    });

    // Then, call the prompt to generate the email, passing the found contact info.
    const { output } = await generateOutreachEmailPrompt({
      ...input,
      foundContactInfo: contactInfo, // Pass the contact info to the prompt
    });

    // Return both the generated email and the contact information found by the tool.
    return {
      draftEmail: output!.draftEmail,
      contactInfo: contactInfo || undefined, // Ensure it's undefined if empty object
    };
  }
);

export async function generateOutreachEmail(
  input: GenerateOutreachEmailInput
): Promise<GenerateOutreachEmailOutput> {
  return generateOutreachEmailFlow(input);
}

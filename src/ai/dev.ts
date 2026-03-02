import { config } from 'dotenv';
config();

import '@/ai/flows/provide-rally-chat-guidance.ts';
import '@/ai/flows/generate-spot-content.ts';
import '@/ai/flows/generate-rally-route-flow.ts';
import '@/ai/flows/generate-outreach-email.ts';
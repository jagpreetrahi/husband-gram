import { defineFunction } from "@aws-amplify/backend";

export const husbandToBookify = defineFunction({ 
    name: 'husband-to-bookify',
    entry: './main.ts',
    memoryMB: 1024,
    timeoutSeconds: 30,
    environment : {
        AI_Provider: 'groq',
        GROQ_API_KEY: process.env.GROQ_API_KEY!,
        MODEL_ID: process.env.MODEL_ID!
    }
})
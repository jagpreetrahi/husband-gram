import { defineFunction } from "@aws-amplify/backend";

export const husbandToBokify = defineFunction({
    name: 'husband-to-bookify',
    entry: './main.ts',
    memoryMB: 1024,
    timeoutSeconds: 30,
    environment : {
        MODEL_ID: 'anthropic.claude-3-5-haiku-20241022-v1:0'
    }
})
import { defineFunction } from "@aws-amplify/backend";

export const husbandAudioTrigger = defineFunction({
    name: 'husband-audio-trigger',
    entry: './main.ts',
    resourceGroupName: 'storage',
    memoryMB: 1024,
    timeoutSeconds: 30
})
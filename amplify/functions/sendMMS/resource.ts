import { defineFunction , secret } from "@aws-amplify/backend";

export const sendMMS = defineFunction({
    name: 'sendMMS',
    entry: './main.ts',
    resourceGroupName: 'data',
    runtime: 22,
    memoryMB: 512,
    
})
import { defineStorage } from "@aws-amplify/backend";
import { textToSpeech } from "../functions/text-to-speech/resource";
import { husbandAudioTrigger } from "../functions/husband-audio-trigger/resource";

export const storage =  defineStorage({
    name: 'book-files',
    access: ( allow ) => ({
        'book-audio/*' : [
            allow.resource(textToSpeech).to(['write']),
            allow.resource(husbandAudioTrigger).to(['read']),
            allow.guest.to(['read'])
        ]
    }),
    triggers: {
        onUpload: husbandAudioTrigger
    }
})
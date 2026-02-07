import { defineBackend } from '@aws-amplify/backend';
import { sendMMS } from './functions/sendMMS/resource'
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda';
import { husbandToBokify } from './functions/husband-to-bookify/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { textToSpeech } from './functions/text-to-speech/resource';
import { husbandAudioTrigger } from './functions/husband-audio-trigger/resource';
import { auth } from './auth/resource';
import { storage } from './storage/resource';

import {
  AppSyncAuthorizationType,
  ChannelNamespace,
  EventApi
} from 'aws-cdk-lib/aws-appsync'


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  storage,
  husbandToBokify,
  textToSpeech,
  husbandAudioTrigger,
  sendMMS

});

// create a websocket APi
const audioEventAPI = new EventApi(backend.stack, 'audioEventAPI', {
  apiName: 'audioEventAPI',
  authorizationConfig: {
    authProviders: [
      { authorizationType: AppSyncAuthorizationType.API_KEY },
      { authorizationType: AppSyncAuthorizationType.IAM },

    ]
  }
})

audioEventAPI.grantPublish(backend.husbandAudioTrigger.resources.lambda);

// create a channle namespace
new ChannelNamespace(backend.stack, 'audioChannel', {
  channelNamespaceName: 'husbandAudioChannel',
  api: audioEventAPI
})


// add a policy statement to the husbandToBookify lamba function
backend.husbandToBokify.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: [
      'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
    ]
  })
)

// add function url to the lamba function
const husbandToBookifyFurl  = 
  backend.husbandToBokify.resources.lambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ['*'],
      allowedMethods: [HttpMethod.ALL],
      allowedHeaders: ['*']
    }
})

const textToSpeechURl = backend.textToSpeech.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['*']
  }
})

const sendMMSURl = backend.sendMMS.resources.lambda.addFunctionUrl({
	authType: FunctionUrlAuthType.NONE,
	cors: {
		allowedOrigins: ['*'],
		allowedMethods: [HttpMethod.ALL],
		allowedHeaders: ['*'],
	},
})

backend.husbandAudioTrigger.addEnvironment(
  'EVENT_API_URL',
  `https://${audioEventAPI.httpDns}/event`
)

backend.husbandAudioTrigger.addEnvironment(
  'EVENT_API_REGION',
  backend.stack.region
)

backend.husbandAudioTrigger.addEnvironment(
  'EVENT_API_NAMESPACE',
  'husbandAudioChannel'
)

// add output to the backend to frontend
backend.addOutput({
  custom: {
     husbandToBokifyUrl: husbandToBookifyFurl.url,
     textToSpeechUrl: textToSpeechURl.url,
     sendMMSUrl: sendMMSURl.url,
     events: {
        url: `https://${audioEventAPI.httpDns}/event`,
        api_key: audioEventAPI.apiKeys['Default'].attrApiKey,
        aws_region: backend.stack.region,
        default_authorization_type: AppSyncAuthorizationType.API_KEY
     }
  }
})
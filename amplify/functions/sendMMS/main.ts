import { env } from '$amplify/env/sendMMS'
import { CfnPhoneNumber } from 'aws-cdk-lib/aws-connect'


export const handler = async (event: { body: string}) => {
    const { mp3URL , phone} = JSON.parse(event.body)
    
    try {
       const response = await fetch('https://api.gupshup.io/wa/api/v1/msg', {
            method: "POST",
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded ",
                apikey: process.env.GUPSHUP_API_KEY!,
            },
            body: new URLSearchParams({
                channel: 'whatsapp',
                source: process.env.GUPSHUP_SOURCE_NUMBER!,
                destination: phone.replace('+', ''), // Gupshup expects no +
                message: JSON.stringify({
                    type: 'audio',
                    audio: {
                    url:  mp3URL
                    }  
                }),
                'src.name': process.env.GUPSHUP_APP_NAME!,
            }),
       })
       const data = await response.json();
       return {
          statusCode: 200,
          body: JSON.stringify({ success: true, gupshupResponse: data}),

       }
    } catch(error) {
        console.error(error)
        return {
            message: 'Error sending MMS'
        }
    }
}
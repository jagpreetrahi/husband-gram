import type { Handler } from 'aws-lambda'
import { env } from '$amplify/env/husband-to-bookify'
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});


export const handler: Handler = async (event) => {
    console.log('the event', event)
    const { interest, subInterest, question , isSpicy } = JSON.parse(event.body)
    console.log("the body is ", interest, subInterest, question, isSpicy)
    console.log(JSON.parse(event.body));

    const prompt = `You specialize in ${interest} and ${subInterest} literature. 
	Transform this husband's simplequestion into how it would be written in that genre of book. Make sure that the question is still there: "${question}"
	${isSpicy ? 'Make it suggestive.' : 'Keep it family-friendly.'}
	Respond with just the transformed phrase, nothing else.`

    try {
       const completion = await groq.chat.completions.create({
            model: env.MODEL_ID,
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: question }
            ],
        })
        console.log("the completion is ", completion)
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: completion.choices[0].message.content
            })
        }
    } catch (error) {
        console.log('groq error' , error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failded to generate response '})
        }
    }
   
}
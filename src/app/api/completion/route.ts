import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export async function POST(req: Request) {

    const { prompt } = await req.json()

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role:'system',
                content: '',
            },
            {
                role: 'user',
                content:'',
            },
        ],
        stream: true
    });
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
}
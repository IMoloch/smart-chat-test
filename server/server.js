import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { CohereClient } from "cohere-ai";

dotenv.config()

const cohere = new CohereClient({
    token: process.env.OPEN_API_KEY
})

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello World"
    })
})
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt
        const response = await cohere.generate ({
            prompt: `${prompt}`,
            maxTokens: 3000,
        })
        console.log(response);
        res.status(200).send({
            bot: response.generations[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

app.listen(3000, () => console.log('Server is running'))
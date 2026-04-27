import {tavily} from '@tavily/core'
import express from "express";
import { streamText ,Output} from 'ai';
import { createGroq } from '@ai-sdk/groq';
import {PROMPT_TEMPLATE , SYSTEM_PROMPT } from './prompt' ;
import z from 'zod'
const client = tavily({apiKey: process.env.TAVILY_API_KEY});
const groq = createGroq({apiKey:process.env.GROQ_API_KEY});

console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "loaded ✅" : "missing ❌");
console.log("TAVILY KEY:", process.env.TAVILY_API_KEY ? "loaded ✅" : "missing ❌");
const app = express()
app.use(express.json());

app.post("/Clario_ask" ,async(req , res)=>{
    try{    
    //step -1: get the query 
    const query = req.body.query; //  Give me the rust resources =>rust resources

    // step2-make sure user has access /credits
    
    // step3-(Todo)check if we have web search indexed for a similar quesry

    // step 4- web search to gather resources
    const webSearchResponse = await client.search(query , {
        searchDepth:"advanced"
    })

    const webSearchResult = webSearchResponse.results;
    // step 5- do some context engineering on the prompt + web search responses

    //step6:- hit llm and stream back responses
    const prompt = PROMPT_TEMPLATE
        .replace("{{WEB_SEARCH_RESULTS}}" ,JSON.stringify(webSearchResult))
        .replace("{{USER_QUERY}}" , query);

       const result = streamText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: prompt,
        system: SYSTEM_PROMPT

    });
    res.header('Cache-Control' , 'no-cache');
    res.header('Content-Type', 'text/event-stream');
    for await (const textPart of result.textStream){
        // process.stdout.write(textPart);
        res.write(textPart); 
    }
    res.write("\nSources\n")
    // step7- ALSO stream back the sources 
 
    res.write(JSON.stringify(webSearchResult.map(result=>({url:result.url}))))

    res.write("\nSources\n")

    // Step-8 Close the event Stream

    res.end();
    }catch(err){
        console.error("Error:" , err);
        res.status(500).end();
    }
});

app.post("/Clario_ask/follow_up" , async(req ,res)=>{
    // step1 :-Get the existing chat from db 
    // step2:-forward full history to the LLM
    // step 2.5: Todo:- Do context Engineering here
    // step 3:-stream the response

})
app.listen(3000);
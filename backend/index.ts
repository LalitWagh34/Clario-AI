import "dotenv/config"; 
import {tavily} from '@tavily/core'
import express from "express";
import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import {PROMPT_TEMPLATE , SYSTEM_PROMPT } from './prompt' ;

import { prisma } from './db';
import { middleware } from './middleware';
import cors from "cors"


declare module "express-serve-static-core"{
    interface Request{
        userId?:string
    }
}
const client = tavily({apiKey: process.env.TAVILY_API_KEY});
const groq = createGroq({apiKey:process.env.GROQ_API_KEY});

console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "loaded ✅" : "missing ❌");
console.log("TAVILY KEY:", process.env.TAVILY_API_KEY ? "loaded ✅" : "missing ❌");

const app = express()
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:5173"],
  credentials: true,
}));

function parseAnswer(raw: string): string {
  const match = raw.match(/<ANSWER>([\s\S]*?)<\/ANSWER>/);
  return match ? match[1].trim() : raw;
}

// PAst conversation get
app.get("/conversation" ,middleware, async(req ,res)=>{
    try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    });
 
    res.json({ conversations });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
})
// Past convesation Get

app.get("/conversation/:conversationID" ,middleware, async(req ,res) =>{
   try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.conversationID,
        userId: req.userId, // ensure user owns this conversation
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
 
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
 
    res.json({ conversation });
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }

})

app.post("/Clario_ask",middleware  ,async(req , res)=>{
      try {
    const query = req.body.query;
 
    if (!query) {
      res.status(400).json({ error: "query is required" });
      return;
    }
 
    // Step 1: Web search
    const webSearchResponse = await client.search(query, {
      searchDepth: "advanced",
    });
    const webSearchResult = webSearchResponse.results;
 
    // Step 2: Build prompt
    const prompt = PROMPT_TEMPLATE
      .replace("{{WEB_SEARCH_RESULTS}}", JSON.stringify(webSearchResult))
      .replace("{{USER_QUERY}}", query);
 
    // Step 3: Stream response
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      system: SYSTEM_PROMPT,
    });
 
    res.header("Cache-Control", "no-cache");
    res.header("Content-Type", "text/event-stream");
 
    let fullResponse = "";
    for await (const textPart of result.textStream) {
      fullResponse += textPart;
      res.write(textPart);
    }
 
    // Step 4: Stream sources
    const sources = webSearchResult.map((r) => ({ url: r.url, title: r.title }));
    res.write("\nSources\n");
    res.write(JSON.stringify(sources));
    res.write("\nSources\n");
 
    // Step 5: Save conversation + messages to DB
    const slug = query
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 60)
      + "-" + Date.now();
 
    const conversation = await prisma.conversation.create({
      data: {
        title: query.slice(0, 100),
        slug,
        userId: req.userId!,
        messages: {
          create: [
            { role: "User", content: query },
            { role: "Assistant", content:parseAnswer(fullResponse)  },
          ],
        },
      },
    });
 
    res.write("\nConversationId\n");
    res.write(JSON.stringify({ conversationId: conversation.id }));
    res.write("\nConversationId\n");
 
    res.end();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).end();
  }
});

app.post("/Clario_ask/follow_up" ,middleware, async(req ,res)=>{
    // step1 :-Get the existing chat from db 
    // step2:-forward full history to the LLM
    // step 2.5: Todo:- Do context Engineering here
    // step 3:-stream the response
      try {
    const { conversationId, query } = req.body;
 
    if (!conversationId || !query) {
      res.status(400).json({ error: "conversationId and query are required" });
      return;
    }
 
    // Step 1: Fetch existing conversation + message history
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: req.userId,
      },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
 
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
 
    // Step 2: Build message history for LLM
    const messageHistory = conversation.messages.map((m) => ({
      role: m.role === "User" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));
 
    // Step 3: Stream follow-up response with full history
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages: [
        ...messageHistory,
        { role: "user", content: query },
      ],
    });
 
    res.header("Cache-Control", "no-cache");
    res.header("Content-Type", "text/event-stream");
 
    let fullResponse = "";
    for await (const textPart of result.textStream) {
      fullResponse += textPart;
      res.write(textPart);
    }
 
    // Step 4: Save new messages to existing conversation
    await prisma.message.createMany({
      data: [
        { role: "User", content: query, conversationId },
        { role: "Assistant", content: fullResponse, conversationId },
      ],
    });
 
    res.end();
  } catch (err) {
    console.error("Error in follow_up:", err);
    res.status(500).end();
  }

})
app.listen(3001, () => console.log("Server running on http://localhost:3001 ✅"));
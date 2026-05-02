import type {NextFunction , Request , Response} from "express"
import { createSupabaseClient } from "./client"
import { prisma } from "./db";

const  client = createSupabaseClient();
export async function  middleware(req:Request , res:Response , next:NextFunction){
    const token = req.headers.authorization;
    const data = await client.auth.getUser(token);

    const userId = data.data.user?.id
    if(userId){
        try{
            
            await prisma.user.upsert({
                where: { supabaseId: userId },
                update: {},
                create:{
                    id:userId,
                    supabaseId:userId,
                    email: data.data.user!.email,
                    provider:data.data.user?.user_metadata.provider === "google"? "Google" :"Github",
                    name :data.data.user?.user_metadata.full_name
                }
            })
        }catch(e){
            console.log("Middleware DB error: " ,e)
        }
        
        req.userId = userId;
        next();
    }else{
        res.status(403).json({
            message:"Incorrect Input"
        })
    }
}
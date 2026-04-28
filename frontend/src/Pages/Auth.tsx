// import { createClient } from "@supabase/supabase-js"
// const supabase = createClient(process.env.VITE_SUPABASE_URL! ,process.env.VITE_SUPABASE_PUBLISHABLE_KEY! )

import { createClient } from "@/lib/client";

const supabase = createClient();

export default function Auth(){
    async function login(provider:"github" | "google"){
        const {data,error} = await supabase.auth.signInWithOAuth({
            provider:provider
        })
        if(error){
            alert("Error While Sign In");
        }else{
            alert("SuccessFully Sign In");
        }
    }

    return <div>
        <button onClick={()=>login("google")}>Login with google</button>
        <button onClick={()=>login("github")}>Login with github</button>
    </div>
}
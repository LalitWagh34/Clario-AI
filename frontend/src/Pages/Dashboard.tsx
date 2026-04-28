import { createClient } from "@/lib/client"
import type {User} from "@supabase/supabase-js" 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const supabase = createClient();
export default function Dashboard(){
    const navigate = useNavigate();
    const [user ,setUser] = useState<User |null>(null);
    useEffect(()=>{
        async function getInfo(){
            const {data ,error} = await supabase.auth.getUser()
            if(data.user){
                setUser(data.user)
            }
        }
        getInfo();
    },[])
    return <div>
        {!user && <button onClick={()=>{
            navigate("/auth");
        }}>SignUP</button>}
        {user && <div>
            {user?.email}
            <button onClick={()=>{
                supabase.auth.signOut()
                setUser(null);
            }}>Log Out</button>
        </div>}
    </div>
}
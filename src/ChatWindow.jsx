import "./ChatWindow.css"
import Chat from "./Chat"
import MyContext from "./Mycontext.jsx";
import { useContext,useState ,useEffect} from "react";
import {ScaleLoader} from "react-spinners";
function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currentThreadId,prevChat,setprevChat,setnewChat}=useContext(MyContext);
    const [loading,setLoading]=useState(false);
    const [isOpen,setisOpen]=useState(false);
    const handleProfile=()=>{
        setisOpen(!isOpen);
    }
    const getReply =async () =>{
        setLoading(true);
        /* setprevChat([]); */
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message:prompt,
                threadId:currentThreadId
            })

        };
        try{
            const response=await fetch("http://localhost:8080/api/chat",options);
            const res=await response.json();
            console.log(res);
            setReply(res.reply);
        }catch(err){
            console.log(err);
        } 
        setLoading(false);
    
};

useEffect(() => {
    if (prompt && reply) {
        setprevChat(prevChat => [
            ...prevChat,
            {
                role: "user",
                content: prompt
            },
            {
                role: "model",
                content: reply
            }
        ]);
    }

    setPrompt("");
}, [reply]);

    
    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>SeekGPT<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIcon" onClick={handleProfile}>
                    <span><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropdownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropdownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropdownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out </div>
                </div>
            }
            <Chat></Chat>
            <ScaleLoader color='#fff' loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        onKeyDown={(e)=>e.key==='Enter'?getReply():''}
                    >
                    
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div> 
                </div>
                <br/>
                <p className="info">
                    SeekGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
            
        </div>
    )
}
export default ChatWindow;
import "./Sidebar.css"
import MyContext from './Mycontext';
import { useState, useEffect, useContext } from 'react';
import { v1 as uuidv1 } from "uuid";
function Sidebar() {
    const { allThreads, setallThreads, currentThreadId, setnewChat, setPrompt, setReply, setThreadId, setprevChat } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filtereddata = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filtereddata);
            setallThreads(filtereddata);
        } catch (err) {
            console.log(err);
        }
    };
    const createNewChat = () => {
        setnewChat(true);
        setPrompt("");
        setReply(null);
        setThreadId(uuidv1());
        setprevChat([]);
    }
    const deleteThread=async(threadId)=>{
        try{
            const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"});
            const res=response.json();
            console.log(res);
            setallThreads(prev=>prev.filter(thread=>thread.threadId !== threadId));

            if(threadId===currentThreadId){
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }

    }
    const changeThread = async (newThreadId) => {
        setThreadId(newThreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setprevChat(res);
            setnewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getAllThreads();
    }, [currentThreadId])
    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/logo.png" alt="logo." className="logo"></img>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId===currentThreadId ? "highlighted":" "}
                            >
                                {thread.title} <i className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                deleteThread(thread.threadId);
                            }}>
                        </i></li>
                    ))
                }
            </ul>
            <div className="sign">
                <p>By SeekGPT</p>
            </div>
        </section>
    )
}
export default Sidebar;
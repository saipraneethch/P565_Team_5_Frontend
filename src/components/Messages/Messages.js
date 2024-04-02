import React from "react"
import Message from './Message';
import useGetMessages from '../../hooks/useGetMessages';
import { useEffect, useRef } from "react";

export const Messages = () => {
    const { messages, loading } = useGetMessages();
    const lastMessageRef=useRef();

    useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

    return (
        <div className='messages'>
            {!loading && 
            messages.length>0 && 
            messages.map((message)=>(
                <div  key ={message._id}
                ref={lastMessageRef}
                > 
                    <Message message={message}/>
                </div>
                
           ))}


            {!loading && messages.length === 0 && (
                <p>Send a message to start the conversation.</p>
            )}

        </div>

    )
}
export default Messages;
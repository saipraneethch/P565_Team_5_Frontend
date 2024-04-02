import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import useConversation from '../../zustand/useConversation';
import extractTime from './extractTimeUtil';
// import extractTime from './extractTime';

export const Message = ({ message }) => {
    const { user } = useAuthContext();
    const { selectedConversation } = useConversation();

    const formattedTime=extractTime(message.createdAt);
    console.log(formattedTime);

    const fromMe = (message.senderId === user._id);

    const divClassName = fromMe ? 'chat chat-start' : 'chat chat-end';
    const messageClassName = fromMe ? 'chat-bubble from' : 'chat-bubble to';
    const side = fromMe ? 'right' : 'left';
    
    return (

        <div>
            <div className={`${divClassName}`}>
                <div className={`${messageClassName}`}>{message.message}</div>
             <div className={`chat-time ${side}`}>Delivered {formattedTime}</div>
             </div>
           
        </div>

        // <div>
        //     {/* message from another user... */}
        //     <div className="chat chat-start">
        //         <div className="chat-bubble from">It's over Anakin, <br />I have the high ground.</div>
        //     </div>

        //     {/* message from the user... */}
        //     <div className="chat chat-end">
        //         <div className="chat-bubble to">You underestimate my power!</div>
        //     </div>
        // </div>

    )
}

export default Message;
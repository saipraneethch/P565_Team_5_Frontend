import Messages from './Messages';
import MessageInput from './MessageInput';
import useConversation from '../../zustand/useConversation';
import { useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { user } = useAuthContext();

    useEffect(() => {//deselects when page changes
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    const userToDisplay = selectedConversation?.participants.filter(participant => String(participant._id).trim() !== String(user._id).trim());

    return (
        <div className='message-container'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (

                <>
                    {/* header content */}
                    <div className="message-header"> {/* bg-slate-500 px-4 py-2 mb-2 */}
                        <span className="username">{selectedConversation.groupChat ?
                            'Group Chat' :
                            userToDisplay.length === 1 ? 
                                userToDisplay[0].first_name + " " + userToDisplay[0].last_name
                                : ""} </span>
                    </div>

                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};

const NoChatSelected = () => {
    return (
        <div className='message-container'>
            <>
                <div className="message-header">
                    <span className="username">Welcome to chat</span>
                    <p>Select a conversation to get started</p>
                </div>
            </>

        </div>
    )
};

export default MessageContainer;
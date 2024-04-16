import Messages from './Messages';
import GroupMessages from './GroupMessages'
import MessageInput from './MessageInput';
import useConversation from '../../zustand/useConversation';
import { useEffect } from 'react';

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();


    useEffect(() => {//deselects when page changes
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    console.log(selectedConversation);
    return (

        <div className='message-container'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (

                <>
                    {/* header content */}
                    <div className="message-header"> {/* bg-slate-500 px-4 py-2 mb-2 */}
                        <span className="username">
                            {selectedConversation.groupChat
                                ? selectedConversation.participants.map(participant => `${participant.first_name} ${participant.last_name}`).join(', ')
                                : `${selectedConversation.first_name} ${selectedConversation.last_name}`}</span>
                    </div>

                    {!selectedConversation.groupChat
                        ? <Messages />
                        : <GroupMessages />}
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
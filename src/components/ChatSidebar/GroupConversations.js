import "../../styles/ChatStyles/index.css";
import GroupConversation from "./GroupConversation";
import useGetGroupConversations from "../../hooks/useGetGroupConversations";
import {useState, useEffect} from 'react';

const GroupConversations = () => {
    const { loading, conversations } = useGetGroupConversations();
    const [groupConversations, setGroupConversations]=useState([]);

    useEffect(() => {
        setGroupConversations(conversations.filter(conversation => conversation.groupChat === true));
    }, [conversations]);

    const updateConversations = (newConversation) => {
        setGroupConversations([...groupConversations, newConversation]);
    };
    
    // console.log("conversations", conversations);
    // const filteredConversations = conversations.filter(conversation => conversation.groupChat === true);
    // console.log("group CONVERSATIONS: ", filteredConversations);
    
    if (loading || !conversations) {
        return (<span>Loading...</span>);
    }
    return (
        <div className='conversations'>
            {conversations.map((conversation, idx) => (
                <GroupConversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === conversations.length - 1}
                />
            ))}

            {/* py-2 flex flex-col overflow-auto */}
            {/* <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation /> */}

        </div>
    )
}
export default GroupConversations;
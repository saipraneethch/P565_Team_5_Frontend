import "../../styles/ChatStyles/index.css";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";

const Conversations = () => {
    const {loading, conversations}=useGetConversations();
    
    const filteredConversations = conversations.filter(conversation => !conversation.groupChat);

    // console.log("CONVERSATIONS: ", conversations);
    return (
        <div className='conversations'>
         {filteredConversations.map((conversation,idx)=>(
            <Conversation
                key={conversation._id}
                conversation={conversation}
                lastIdx={idx===conversations.length-1}
            />
         ))}
            {loading ? <span>Loading...</span> : null}

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
export default Conversations;
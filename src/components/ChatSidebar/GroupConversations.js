import "../../styles/ChatStyles/index.css";
import GroupConversation from "./GroupConversation";
import useGetGroupConversations from "../../hooks/useGetGroupConversations";

const GroupConversations = () => {
    const { loading, conversations } = useGetGroupConversations();

    console.log("conversations", conversations);

    // const filteredConversations = conversations.filter(conversation => conversation.groupChat===true);

    // console.log("group CONVERSATIONS: ", filteredConversations);

    return (
        <div className='conversations'>
            {conversations.map((conversation, idx) => (
                <GroupConversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === conversations.length - 1}
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
export default GroupConversations;
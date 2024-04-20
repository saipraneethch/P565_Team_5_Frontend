import "../../styles/ChatStyles/index.css";
import Conversation from "./Conversation";
// import useGetConversations from "../../hooks/useGetConversations";

const Conversations = ({conversations}) => {
    // const {loading, conversations}=useGetConversations();
    
    // console.log("CONVERSATIONS: ", conversations);
    return (
        <div className='conversations'>
         {conversations.map((conversation,idx)=>(
            <Conversation
                key={conversation._id}
                conversation={conversation}
                lastIdx={idx===conversations.length-1}
            />
         ))}
            {/* {loading ? <span>Loading...</span> : null} */}

        </div>
    )
}
export default Conversations;
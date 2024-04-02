import useConversation from '../../zustand/useConversation';

const Conversation = ({ conversation, lastIdx }) => {
    
    const{selectedConversation, setSelectedConversation}= useConversation();
    const isSelected = selectedConversation?._id===conversation._id;

    return <>
        <div className={`conversation ${isSelected ? 'conversationSelected' : ''}`
    }onClick={()=> setSelectedConversation(conversation)}   >
                    
            <div className="online-status">
                {/* insert div for avatar/profile pic */}
            </div>
            <div className="flex-container">
                {/* flex flex-col flex-1 */}
                <div className="flex-item">
                    <p className="username">{conversation.first_name} {conversation.last_name}</p>
                    <span>active?</span>
                </div>
            </div>
        </div>
        {/* divider my-0 py-0 h-1 */}
        {!lastIdx && <div className="divider"></div>}

    </>
}
export default Conversation;
import useConversation from '../../zustand/useConversation';
import { useAuthContext } from '../../hooks/useAuthContext';

const Conversation = ({ conversation, lastIdx }) => {

    const { selectedConversation, setSelectedConversation } = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;
    const { user } = useAuthContext();
    // console.log('selected conversation', selectedConversation);
    // console.log("users id logged in", user._id);
    // console.log("conversations", conversation);
    // console.log("users before", conversation.participants);

    const usersToDisplay = conversation.participants.filter(participant => participant._id !== user._id);
  
    // console.log("users after", usersToDisplay);

    return <>
        <div className={`conversation ${isSelected ? 'conversationSelected' : ''}`
        } onClick={() => setSelectedConversation(conversation)}   >
            

            <div className="online-status">
                {/* insert div for avatar/profile pic */}
            </div>
            <div className="flex-container">
                <div className="flex-item">
                    <p className="username">
                        {conversation.groupChat
                            ?
                            // group chat names ... 
                            usersToDisplay.map(participant =>
                                `${participant.first_name} ${participant.last_name}`).join(', ')
                            :
                            //direct chat name ... 
                            usersToDisplay.length === 1 ? `${usersToDisplay[0].first_name} ${usersToDisplay[0].last_name}`

                                : 'User not found'
                        }
                    </p>
                    {/* <p className="username">{conversation.first_name} {conversation.last_name}</p> */}
                </div>
            </div>
        </div >
        {!lastIdx && <div className="divider"></div>}

    </>
}
export default Conversation;
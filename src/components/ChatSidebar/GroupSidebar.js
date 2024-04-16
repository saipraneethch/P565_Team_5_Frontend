import GroupConversations from "./GroupConversations";
import NewGroupChat from "../Messages/NewGroupChat";
import "../../styles/ChatStyles/index.css";
import { useState, useEffect } from 'react';
import useGetGroupConversations from "../../hooks/useGetGroupConversations";


const GroupSidebar = () => {
    const { loading, conversations } = useGetGroupConversations();
    // const [allConversations, setConversations] = useState(false);

    // const updateConversations = (newConversation) => {
    //     setConversations(prev => !prev);
    //     // setConversations([...allConversations, newConversation]);
    // };

    return (
        <div className="sidebar-container">
            {/* border-r border-gray-500 p-4 flex flex-col */}
            {/* could input search here */}
            {/* < GroupConversations conversations={conversations} /> */}

            < GroupConversations conversations={conversations} />
            {/* could input logout here */}
        </div>
    )
}
export default GroupSidebar;
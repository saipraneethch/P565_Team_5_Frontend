import '../styles/ChatStyles/index.css';
import { Link } from "react-router-dom";

import React from 'react'
import { useEffect } from 'react';

import MessageContainer from "../components/Messages/MessageContainer";
import NewGroupChat from '../components/Messages/NewGroupChat';
import GroupSidebar from "../components/ChatSidebar/GroupSidebar";
import useGetGroupConversations from '../hooks/useGetGroupConversations';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../hooks/useAuthContext';


const GroupChat = () => {
    const { loading, conversations } = useGetGroupConversations();
    const [allConversations, setConversations] = useState(conversations);

    const updateConversations = () => {
        setConversations(prev => !prev);

        // setConversations([...allConversations, newConversation]);
    };


    return (
        <div>
            <h1 className='chat-page-header'>Group Chats</h1>
            <Link to="/groupchat">
                <span className='chat-links active'>
                    Group Chat
                </span>

            </Link>
            <Link to="/chat">
                <span className='chat-links'>
                    Direct Chat
                </span>
            </Link>
            <div className='chat-main'>
                {/* insert sidebar and messageContainer components */}
                {/* <NewGroupChat/> */}
                <NewGroupChat updateConversations={updateConversations} />
                <GroupSidebar />
                <MessageContainer />
            </div>

        </div>
    );
};
export default GroupChat;
import '../styles/ChatStyles/index.css';
import { Link } from "react-router-dom";

import React from 'react'
import { useEffect } from 'react';

import MessageContainer from "../components/Messages/MessageContainer";
import GroupSidebar from "../components/ChatSidebar/GroupSidebar";

// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../hooks/useAuthContext';


const GroupChat = () => {
    //this is taken care of in routes. no need to duplicate here
    // const { user } = useAuthContext();
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user) {
    //         // Redirect to login page if no user is logged in
    //         navigate('/login');
    //     }
    // }, [user, navigate]);
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
                <GroupSidebar />
			    <MessageContainer />
            </div>
         
        </div>
    );
};
export default GroupChat;
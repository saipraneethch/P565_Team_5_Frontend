import '../styles/ChatStyles/index.css';

import React from 'react'
import { useEffect, useState } from 'react';

import MessageContainer from "../components/Messages/MessageContainer";
import Sidebar from "../components/ChatSidebar/Sidebar";
import NewGroupChat from "../components/NewGroupChat";

import useGetConversations from '../hooks/useGetConversations';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';


const Chat = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { loading, conversations } = useGetConversations();

    useEffect(() => {
        if (!user) {
            // Redirect to login page if no user is logged in
            navigate('/login');
        }
    }, [user, navigate]);
    return (
        <div className='chat-container'>
            <div className='chat-main'>
                <Sidebar conversations={conversations} />
                <MessageContainer />
            </div>
            <div className='new-chat'>
                <NewGroupChat />
            </div>
        </div>
    );
};
export default Chat;
import '../styles/ChatStyles/index.css';
import { Link } from "react-router-dom";

import React from 'react'
import { useEffect } from 'react';

import MessageContainer from "../components/Messages/MessageContainer";
import Sidebar from "../components/ChatSidebar/Sidebar";

import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';


const Chat = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Redirect to login page if no user is logged in
            navigate('/login');
        }
    }, [user, navigate]);
    return (
        <div>
            <h1 className='chat-page-header'>Direct Chats</h1>
            <Link to="/groupchat">
                <span className='chat-links'>
                    Group Chat
                </span>

            </Link>
            <Link to="/chat">
                <span className='chat-links active'>

                    Direct Chat
                </span>
            </Link>
            <div className='chat-main'>
                {/* insert sidebar and messageContainer components */}
                <Sidebar />
                <MessageContainer />
            </div>
            {/* <a href="/groupchat">
                <button>
                    Group Chats
                </button>
            </a> */}

        </div>
    );
};
export default Chat;
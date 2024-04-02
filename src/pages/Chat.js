import '../styles/ChatStyles/index.css';

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
            <div className='chat-main'>
                {/* insert sidebar and messageContainer components */}
                <Sidebar />
			    <MessageContainer />
            </div>
        </div>
    );
};
export default Chat;
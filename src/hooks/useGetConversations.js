import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const { user } = useAuthContext();

    // console.log("user in usegetconvo:", user);
    // console.log("token test",user.token);

    useEffect(() => {
        const getConversations = async () => {

            setLoading(true);
            try {

                // console.log("user test:",user);
                // console.log("token", user.token);

                const res = await fetch(`/api/v1/conversations/get/${user._id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                // console.log("DATA CONVERSATIONS", data);

                if (data.error) {
                    // console.log("data error", data.error);
                    throw new Error(data.error);
                }

                // Improved sorting logic
                const sortedData = data.sort((a, b) => {
                    // Get the last message from each conversation safely
                    const getLastMessageTime = (messages) => {
                        if (messages.length === 0) return new Date(0);
                        const lastMessage = messages[messages.length - 1];
                        return new Date(lastMessage.createdAt || 0);
                    };

                    const timeA = getLastMessageTime(a.messages);
                    const timeB = getLastMessageTime(b.messages);

                    return timeB - timeA; // Sort descending
                });
                setConversations(sortedData);
                // setConversations(data);

            } catch (error) {
                console.error('Error fetching conversations:', error);

            } finally {
                setLoading(false);
            }
        };
        getConversations();
    }, [user]);

    return { loading, conversations };
}

export default useGetConversations;



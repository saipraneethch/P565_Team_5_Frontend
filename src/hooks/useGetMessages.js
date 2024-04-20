import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import { useAuthContext } from './useAuthContext';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const {user} = useAuthContext();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                //this works, but i thought that the api call was supposed to use the receiving user id, not the conversation object id...
                const res = await fetch(`api/v1/messages/${selectedConversation._id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (data.error) throw new Error(data.error)

                setMessages(data)

            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (selectedConversation?._id) getMessages();

    }, [selectedConversation._id, setMessages, user.token]);


    return { messages, loading }
}

export default useGetMessages
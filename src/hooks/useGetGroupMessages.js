import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import { useAuthContext } from './useAuthContext';

const useGetGroupMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { user } = useAuthContext();
    console.log("test print messages", messages);

    useEffect(() => {
        const getGroupMessages = async () => {
            setLoading(true);
            try {
                console.log("conversation id test", selectedConversation._id);
                const res = await fetch(`api/v1/groupmessages/${selectedConversation._id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log("messages", data);

                if (data.error) throw new Error(data.error)

                setMessages(data)

            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (selectedConversation?._id) getGroupMessages();

    }, [selectedConversation._id, setMessages, user.token]);


    return { messages, loading }
}

export default useGetGroupMessages
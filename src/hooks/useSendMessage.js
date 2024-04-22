import { useState } from 'react';
import useConversation from '../zustand/useConversation';
import { useAuthContext } from './useAuthContext';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { user } = useAuthContext();


    const sendMessage = async (message) => {
        setLoading(true);
        try {
            //seems like this id should actually be the recipient user id, not the conversation id
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/messages/send/${selectedConversation._id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    //add authentification here?
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message})
            })

            const data = await res.json()

            if(data.error) throw new Error (data.error)

            setMessages([...messages, data])

        } catch (error) {
            console.log(error.message);//reaching this when send button is pushed
        } finally {
            setLoading(false);
        }
    }
    return {sendMessage, loading}
}

export default useSendMessage
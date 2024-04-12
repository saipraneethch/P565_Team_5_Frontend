import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';

const useGetGroupConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const { user } = useAuthContext();

    // console.log("user in usegetconvo:", user);
    // console.log("token test",user.token);

    useEffect(() => {
        const getGroupConversations = async () => {

            setLoading(true);
            try {

                // console.log("user test:",user);
                // console.log("token", user.token);

                const res = await fetch(`/api/v1/groupmessages/conversations/${user._id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                //uses the user.route;  sidebar-users calls function getSidebarUsers

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                // let groups = data.filter(conversation => conversation.groupChat);

                setConversations(data);

            } catch (error) {
                console.error('Error fetching group conversations:', error);

            } finally {
                setLoading(false);
            }
        };
        getGroupConversations();
    }, [user]);

    return { loading, conversations };
}

export default useGetGroupConversations;
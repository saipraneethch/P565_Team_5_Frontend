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

                const res = await fetch(`/api/v1/sidebar-users/${user.token}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                //uses the user.route;  sidebar-users calls function getSidebarUsers

                const data = await res.json();
                // console.log("DATA", data);

                if (data.error) {
                    // console.log("data error", data.error);
                    throw new Error(data.error);
                }
                setConversations(data);
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
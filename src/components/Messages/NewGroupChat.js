import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUsersContext } from "../../hooks/useUserContext";
// import updateConversations from '../ChatSidebar/GroupSidebar';
import useConversation from '../../zustand/useConversation';

const NewGroupChat = ({ updateConversations }) => {
    // const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [matchedUsers, setMatchedUsers] = useState([]);
    const { user } = useAuthContext();
    const { users, dispatch } = useUsersContext();

    const { setSelectedConversation } = useConversation();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/v1/userdetails", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const json = await response.json();
                console.log(json)

                if (response.ok) {
                    dispatch({ type: "SET_USERS", payload: json });
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };
        fetchUsers();
    }, [dispatch, user.token]);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        setMatchedUsers(users.filter(user =>
            user.username.toLowerCase().includes(event.target.value.toLowerCase())
        ));
    };

    const handleUserClick = (user) => {
        if (!selectedUsers.includes(user)) {
            setSelectedUsers([...selectedUsers, user]);
            setSearchTerm('');
            setMatchedUsers([]);
        }

    };

    const handleCreateGroupChat = async () => {
        // Send API request to create group chat with selected users and logged in user
        try {
            const response = await fetch('api/v1/groupmessages/creategroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type
                    Authorization: `Bearer ${user.token}`, // Include authorization token
                },
                body: JSON.stringify({
                    participants: [...selectedUsers.map(user => user._id), user._id],
                    groupChat: true
                })
            });
            const data = await response.json();

            console.log('Group chat created:', data);

            updateConversations(data);

            setSelectedConversation(data._id);

        } catch (error) {
            console.error('Error creating group chat:', error);
        }
    };

    return (
        <div className='new-chat'>
            <h3>Create New Group Chat</h3>
            <div>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <ul>
                    {matchedUsers.map(user => (
                        <li key={user._id} onClick={() => handleUserClick(user)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4>Selected Users:</h4>
                <ul>
                    {selectedUsers.map(user => (
                        <li key={user._id}>{user.username}</li>
                    ))}
                </ul>
            </div>
            <button onClick={handleCreateGroupChat}>Create Group Chat</button>
        </div>
    );
};

export default NewGroupChat;

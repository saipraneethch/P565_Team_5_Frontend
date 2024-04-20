import { create } from 'zustand'

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation)=> set({selectedConversation}),
    messages: [],
    setMessages: (messages)=> set({messages}),
    groupChat: false,  
    setGroupChat: (groupChat) => set({ groupChat }),
    participants: [],
    setParticipants: (participants) => set({participants}),
    conversations: [],
    setConversations: (conversations) => set({ conversations }),
}));

export default useConversation;
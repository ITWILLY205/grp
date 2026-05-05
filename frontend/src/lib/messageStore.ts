import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  chatId: number;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

interface MessageStore {
  messages: ChatMessage[];
  sendMessage: (chatId: number, text: string) => void;
  receiveMessage: (chatId: number, text: string) => void;
  getChatMessages: (chatId: number) => ChatMessage[];
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [
        { id: '1', chatId: 1, sender: 'them', text: "I wanted to check on Alice's conduct marks this term.", timestamp: "10:45 AM" },
        { id: '2', chatId: 1, sender: 'me', text: "Good morning, Mr. Gakuba. I appreciate your feedback regarding the marks. We will review them shortly.", timestamp: "10:48 AM" },
        { id: '3', chatId: 2, sender: 'them', text: "I have submitted the behavior report for Form 4.", timestamp: "9:30 AM" },
      ],
      
      sendMessage: (chatId, text) => {
        const newMessage: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          chatId,
          sender: 'me',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },

      receiveMessage: (chatId, text) => {
        const newMessage: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          chatId,
          sender: 'them',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },

      getChatMessages: (chatId) => {
        return get().messages.filter(m => m.chatId === chatId);
      }
    }),
    {
      name: 'scholar-sphere-messages',
    }
  )
);

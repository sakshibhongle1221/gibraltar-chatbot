import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

const MAX_CHATS = 4;
const getInitialBotMessage = () => ({
  id: Date.now(),
  type: 'bot',
  content: {
    paragraphs: ['Hi user What do you want to learn?'],
    sections: []
  },
  avatar: 'https://static.thenounproject.com/png/2781734-512.png'
});

const flutterInitialMessage = {
  id: 1,
  type: 'bot',
  content: {
    paragraphs: [
      "Flutter is Google's open-source UI toolkit designed to build beautiful, natively compiled applications for mobile, web, desktop, and embedded devices from a single codebase.",
      "In 2026, it has solidified its place as the industry standard for cross-platform development, largely because it doesn't just \"wrap\" native components—it draws them itself."
    ],
    sections: [
      {
        title: "The Language: Dart",
        text: "Flutter uses Dart, a language also developed by Google. It's the engine under the hood that makes Flutter fast.",
        bullets: [
          "AOT (Ahead-of-Time) Compilation: Compiles to fast, native machine code for production.",
          "JIT (Just-in-Time) Compilation: Powers the \"Hot Reload\" feature during development, letting you see code changes in sub-seconds without losing your app's state."
        ]
      }
    ]
  },
  avatar: 'https://static.thenounproject.com/png/2781734-512.png'
};

const flutterUserMessage = {
  id: 0,
  type: 'user',
  content: 'Briefly explain the basics of Flutter',
  avatar: 'https://static.thenounproject.com/png/2781297-512.png'
};

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([
    { 
      id: '1', 
      name: 'Basics of Flutter',
      messages: [flutterUserMessage, flutterInitialMessage]
    }
  ]);
  
  const [activeChatId, setActiveChatId] = useState('1');
  const [toastMessage, setToastMessage] = useState(null);

  const [nestedConversation, setNestedConversation] = useState(null);

  const [storedNests, setStoredNests] = useState({});

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const messages = activeChat?.messages || [];

  const showToast = useCallback((message, kind = 'error') => {
    setToastMessage({ message, kind });
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const getNestKey = useCallback((messageId, contextText) => {
    return `${activeChatId}-${messageId}-${contextText.substring(0, 50)}`;
  }, [activeChatId]);

  const hasNest = useCallback((messageId, contextText) => {
    const key = getNestKey(messageId, contextText);
    return !!storedNests[key];
  }, [getNestKey, storedNests]);

  const getStoredNest = useCallback((messageId, contextText) => {
    const key = getNestKey(messageId, contextText);
    return storedNests[key] || null;
  }, [getNestKey, storedNests]);

  const openNestedConversation = useCallback((contextText, messageId) => {
    const key = getNestKey(messageId, contextText);
    const existingNest = storedNests[key];

    setNestedConversation({
      contextText,
      messageId,
      key,
      messages: existingNest?.messages || []
    });
  }, [getNestKey, storedNests]);

  const closeNestedConversation = useCallback(() => {
    setNestedConversation(null);
  }, []);

  const addNestedMessage = useCallback((newMessages) => {
    setNestedConversation(prev => {
      const updatedMessages = [...prev.messages, ...newMessages];
      setStoredNests(prevStored => ({
        ...prevStored,
        [prev.key]: {
          contextText: prev.contextText,
          messageId: prev.messageId,
          messages: updatedMessages
        }
      }));
      return {
        ...prev,
        messages: updatedMessages
      };
    });
  }, []);

  const createNewChat = useCallback(() => {
    if (chats.length >= MAX_CHATS) {
      showToast(`Maximum conversation limit reached (${MAX_CHATS} chats).`, 'error');
      return null;
    }
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      name: `Chat ${chats.length + 1}`,
      messages: [getInitialBotMessage()]
    };

    setChats(prevChats => [newChat, ...prevChats]);
    setActiveChatId(newChatId);
    setNestedConversation(null);

    return newChatId;
  }, [chats.length, showToast]);

  const switchChat = useCallback((chatId) => {
    if (nestedConversation) {
      setStoredNests(prev => ({
        ...prev,
        [nestedConversation.key]: {
          contextText: nestedConversation.contextText,
          messageId: nestedConversation.messageId,
          messages: nestedConversation.messages
        }
      }));
    }
    setActiveChatId(chatId);
    setNestedConversation(null);
  }, [nestedConversation]);

  const addMessages = useCallback((newMessages) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, ...newMessages] }
          : chat
      )
    );
  }, [activeChatId]);

  const updateChatName = useCallback((chatId, name) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, name: name.substring(0, 30) + (name.length > 30 ? '...' : '') }
          : chat
      )
    );
  }, []);

  const value = {
    chats,
    activeChatId,
    messages,
    createNewChat,
    switchChat,
    addMessages,
    updateChatName,
    toastMessage,
    clearToast,
    maxChats: MAX_CHATS,
    nestedConversation,
    openNestedConversation,
    closeNestedConversation,
    addNestedMessage,
    hasNest,
    getStoredNest
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
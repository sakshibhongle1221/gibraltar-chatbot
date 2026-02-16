import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

const MAX_CHATS = 4;
const MAX_NEST_DEPTH = 3;

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
  const [nestedStack, setNestedStack] = useState([]);

  const [storedNests, setStoredNests] = useState({});

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const messages = activeChat?.messages || [];

  const showToast = useCallback((message, kind = 'error') => {
    setToastMessage({ message, kind });
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const getNestKey = useCallback((depth, messageId, contextText, parentKey = null) => {
    const baseKey = parentKey || activeChatId;
    return `${baseKey}-depth${depth}-${messageId}-${contextText.substring(0, 50)}`;
  }, [activeChatId]);

  const hasNest = useCallback((depth, messageId, contextText, parentKey = null) => {
    const key = getNestKey(depth, messageId, contextText, parentKey);
    return !!storedNests[key];
  }, [getNestKey, storedNests]);

  const getStoredNest = useCallback((depth, messageId, contextText, parentKey = null) => {
    const key = getNestKey(depth, messageId, contextText, parentKey);
    return storedNests[key] || null;
  }, [getNestKey, storedNests]);

  const openNestedConversation = useCallback((contextText, messageId, depth = 0, parentKey = null) => {
    if (depth >= MAX_NEST_DEPTH - 1) {
      showToast(`Maximum nesting depth reached (${MAX_NEST_DEPTH} levels).`, 'warning');
      return;
    }

    const key = getNestKey(depth, messageId, contextText, parentKey);
    const existingNest = storedNests[key];

    setNestedStack(prev => {
      const newStack = prev.slice(0, depth);
      return [...newStack, {
        contextText,
        messageId,
        key,
        depth,
        parentKey,
        messages: existingNest?.messages || []
      }];
    });
  }, [getNestKey, storedNests, showToast]);

  const closeNestedConversation = useCallback((depth = 0) => {
    setNestedStack(prev => {
      const nestsToSave = prev.slice(depth);
      nestsToSave.forEach(nest => {
        if (nest.messages.length > 0) {
          setStoredNests(stored => ({
            ...stored,
            [nest.key]: {
              contextText: nest.contextText,
              messageId: nest.messageId,
              parentKey: nest.parentKey,
              messages: nest.messages
            }
          }));
        }
      });
      return prev.slice(0, depth);
    });
  }, []);

  const addNestedMessage = useCallback((newMessages, depth) => {
    setNestedStack(prev => {
      const newStack = [...prev];
      if (newStack[depth]) {
        const updatedMessages = [...newStack[depth].messages, ...newMessages];
        newStack[depth] = {
          ...newStack[depth],
          messages: updatedMessages
        };

        setStoredNests(stored => ({
          ...stored,
          [newStack[depth].key]: {
            contextText: newStack[depth].contextText,
            messageId: newStack[depth].messageId,
            parentKey: newStack[depth].parentKey,
            messages: updatedMessages
          }
        }));
      }
      return newStack;
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
    setNestedStack([]);

    return newChatId;
  }, [chats.length, showToast]);

  const switchChat = useCallback((chatId) => {
    nestedStack.forEach(nest => {
      if (nest.messages.length > 0) {
        setStoredNests(stored => ({
          ...stored,
          [nest.key]: {
            contextText: nest.contextText,
            messageId: nest.messageId,
            parentKey: nest.parentKey,
            messages: nest.messages
          }
        }));
      }
    });
    
    setActiveChatId(chatId);
    setNestedStack([]);
  }, [nestedStack]);

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

  const currentDepth = nestedStack.length;
  const canNestDeeper = currentDepth < MAX_NEST_DEPTH - 1;

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
    maxNestDepth: MAX_NEST_DEPTH,
    nestedStack,
    currentDepth,
    canNestDeeper,
    openNestedConversation,
    closeNestedConversation,
    addNestedMessage,
    hasNest,
    getStoredNest,
    getNestKey
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

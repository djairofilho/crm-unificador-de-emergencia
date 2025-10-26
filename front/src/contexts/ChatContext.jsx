import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Atualizar conversa existente ou criar nova
  const updateConversation = useCallback((phoneNumber, message) => {
    setConversations(prev => {
      const existing = prev[phoneNumber] || {
        phoneNumber,
        name: phoneNumber,
        lastMessage: '',
        lastMessageTime: 0,
        unread: 0,
        messages: []
      };

      // Verificar se a mensagem já existe (evitar duplicatas)
      const messageExists = existing.messages.some(msg => msg.id === message.id);
      if (messageExists) {
        return prev;
      }

      const updatedMessages = [...existing.messages, {
        id: message.id,
        from: message.from,
        text: message.text,
        type: message.type,
        timestamp: message.timestamp,
        sent: message.sent || false,
        status: message.status || 'read',
        mediaData: message.mediaData,
        receivedAt: message.receivedAt
      }];

      return {
        ...prev,
        [phoneNumber]: {
          ...existing,
          lastMessage: message.text,
          lastMessageTime: message.timestamp,
          messages: updatedMessages
        }
      };
    });
  }, []);

  // Adicionar mensagem enviada
  const addSentMessage = useCallback((phoneNumber, message) => {
    setConversations(prev => {
      const existing = prev[phoneNumber] || {
        phoneNumber,
        name: phoneNumber,
        lastMessage: '',
        lastMessageTime: 0,
        unread: 0,
        messages: []
      };

      const messageId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sentMessage = {
        id: messageId,
        from: 'me',
        text: message.text,
        type: 'text',
        timestamp: Date.now(),
        sent: true,
        status: 'sent',
        mediaData: null,
        receivedAt: new Date().toISOString()
      };

      // Verificar se a mensagem já existe (evitar duplicatas)
      const messageExists = existing.messages.some(msg => msg.id === messageId);
      if (messageExists) {
        return prev;
      }

      const updatedMessages = [...existing.messages, sentMessage];

      return {
        ...prev,
        [phoneNumber]: {
          ...existing,
          lastMessage: message.text,
          lastMessageTime: Date.now(),
          messages: updatedMessages
        }
      };
    });
  }, []);

  // Selecionar conversa
  const selectConversation = useCallback((phoneNumber) => {
    setSelectedConversation(phoneNumber);
    
    // Marcar mensagens como lidas
    if (phoneNumber && conversations[phoneNumber]) {
      setConversations(prev => ({
        ...prev,
        [phoneNumber]: {
          ...prev[phoneNumber],
          unread: 0
        }
      }));
    }
  }, [conversations]);

  // Obter conversas ordenadas por última mensagem
  const getSortedConversations = useCallback(() => {
    return Object.values(conversations).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [conversations]);

  // Obter mensagens da conversa selecionada
  const getCurrentMessages = useCallback(() => {
    if (!selectedConversation || !conversations[selectedConversation]) {
      return [];
    }
    return conversations[selectedConversation].messages;
  }, [selectedConversation, conversations]);

  // Verificar se é mobile
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const value = {
    conversations,
    selectedConversation,
    isMobile,
    updateConversation,
    addSentMessage,
    selectConversation,
    getSortedConversations,
    getCurrentMessages,
    checkMobile
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

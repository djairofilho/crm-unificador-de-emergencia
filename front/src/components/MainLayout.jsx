import { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const MainLayout = ({ onSendMessage }) => {
  const { 
    selectedConversation, 
    selectConversation, 
    isMobile, 
    checkMobile 
  } = useChat();
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChat, setShowChat] = useState(!isMobile);

  // Verificar se é mobile na montagem e redimensionamento
  useEffect(() => {
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkMobile]);

  // Ajustar visibilidade dos painéis baseado no mobile
  useEffect(() => {
    if (isMobile) {
      if (selectedConversation) {
        setShowSidebar(false);
        setShowChat(true);
      } else {
        setShowSidebar(true);
        setShowChat(false);
      }
    } else {
      setShowSidebar(true);
      setShowChat(true);
    }
  }, [isMobile, selectedConversation]);

  const handleConversationSelect = (phoneNumber) => {
    selectConversation(phoneNumber);
    
    if (isMobile) {
      setShowSidebar(false);
      setShowChat(true);
    }
  };

  const handleBackToSidebar = () => {
    if (isMobile) {
      setShowSidebar(true);
      setShowChat(false);
      selectConversation(null);
    }
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
      setShowChat(!showChat);
    }
  };

  const handleSendMessage = (phoneNumber, messageText) => {
    if (onSendMessage) {
      onSendMessage(phoneNumber, messageText);
    }
  };

  // Determinar classe CSS baseada no estado
  const containerClass = 'whatsapp-container';

  return (
    <div className={containerClass}>
      {/* Sidebar de Conversas */}
      {showSidebar && (
        <Sidebar
          onConversationSelect={handleConversationSelect}
          isMobile={isMobile}
          onMenuClick={handleMenuClick}
        />
      )}

      {/* Chat Area */}
      {showChat && (
        <ChatArea
          selectedConversation={selectedConversation}
          isMobile={isMobile}
          onBack={handleBackToSidebar}
          onSendMessage={handleSendMessage}
        />
      )}


      {/* Overlay para mobile quando sidebar de conversas está aberta */}
      {isMobile && showSidebar && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;

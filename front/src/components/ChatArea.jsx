import { useChat } from '../contexts/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({ 
  selectedConversation, 
  isMobile, 
  onBack,
  onSendMessage 
}) => {
  const { getCurrentMessages } = useChat();
  
  const messages = getCurrentMessages();
  const conversation = selectedConversation ? 
    { phoneNumber: selectedConversation } : null;

  const handleSendMessage = (messageText) => {
    if (onSendMessage && selectedConversation) {
      onSendMessage(selectedConversation, messageText);
    }
  };

  const handleCall = (phoneNumber) => {
    // TODO: Implementar chamada
    console.log('Ligar para:', phoneNumber);
  };

  const handleVideoCall = (phoneNumber) => {
    // TODO: Implementar vídeo chamada
    console.log('Vídeo chamada para:', phoneNumber);
  };

  return (
    <div className="whatsapp-chat-area">
      {/* Header do Chat */}
      <ChatHeader
        conversation={conversation}
        isMobile={isMobile}
        onBack={onBack}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
      />

      {/* Lista de Mensagens */}
      <MessageList 
        messages={messages}
        currentUser="me"
        conversationKey={selectedConversation}
      />

      {/* Input de Mensagem */}
      {selectedConversation && (
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={false}
        />
      )}
    </div>
  );
};

export default ChatArea;

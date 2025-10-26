import { formatTime, formatPhoneNumber } from '../utils/formatters';

const ConversationItem = ({ 
  conversation, 
  isSelected, 
  onClick 
}) => {
  const handleClick = () => {
    onClick(conversation.phoneNumber);
  };

  const getInitials = (phoneNumber) => {
    // Extrair os últimos 2 dígitos do número
    const lastTwo = phoneNumber.slice(-2);
    return lastTwo;
  };

  const formatLastMessage = (message) => {
    if (!message) return '';
    if (message.length > 50) {
      return message.substring(0, 50) + '...';
    }
    return message;
  };

  return (
    <div 
      className={`conversation-item ${isSelected ? 'active' : ''}`}
      onClick={handleClick}
    >
      {/* Avatar */}
      <div className="conversation-avatar">
        {getInitials(conversation.phoneNumber)}
      </div>

      {/* Conteúdo */}
      <div className="conversation-content">
        {/* Header com nome e horário */}
        <div className="conversation-header">
          <div className="conversation-name">
            {formatPhoneNumber(conversation.phoneNumber)}
          </div>
          <div className="conversation-time">
            {formatTime(conversation.lastMessageTime)}
          </div>
        </div>

        {/* Preview da última mensagem */}
        <div className="conversation-preview">
          {formatLastMessage(conversation.lastMessage)}
          {conversation.unread > 0 && (
            <div className="conversation-unread">
              {conversation.unread > 99 ? '99+' : conversation.unread}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;

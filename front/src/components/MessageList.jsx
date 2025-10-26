import { useEffect, useRef } from 'react';
import Message from './Message';
import { formatDate, normalizeTimestamp } from '../utils/formatters';

const MessageList = ({ messages, currentUser, conversationKey }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Agrupar mensagens por data
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;
    let currentDate = null;

    messages.forEach((message, index) => {
      const timestamp = normalizeTimestamp(message.timestamp);
      const messageDate = new Date(timestamp);
      const dateString = messageDate.toDateString();

      if (dateString !== currentDate) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          date: dateString,
          messages: [message]
        };
        currentDate = dateString;
      } else {
        currentGroup.messages.push(message);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="empty-chat">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
        <h3>Nenhuma mensagem de emergência</h3>
        <p>Aguarde chamadas de emergência ou inicie o atendimento</p>
      </div>
    );
  }

  return (
    <div className="messages-container" ref={messagesContainerRef}>
      <div className="messages-list">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Divisor de data */}
            <div className="message-date-divider">
              <span className="message-date-text">
                {formatDate(new Date(group.date))}
              </span>
            </div>

            {/* Mensagens do grupo */}
            {group.messages.map((message, messageIndex) => {
              const isOwn = message.from === 'me' || message.sent;
              const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
              const nextMessage = messageIndex < group.messages.length - 1 ? group.messages[messageIndex + 1] : null;
              
              // Determinar se deve agrupar com a mensagem anterior
              const shouldGroupWithPrevious = prevMessage && 
                Math.abs(message.timestamp - prevMessage.timestamp) < 300000 && // 5 minutos
                (prevMessage.from === 'me' || prevMessage.sent) === isOwn;

              // Determinar se deve agrupar com a próxima mensagem
              const shouldGroupWithNext = nextMessage && 
                Math.abs(nextMessage.timestamp - message.timestamp) < 300000 && // 5 minutos
                (nextMessage.from === 'me' || nextMessage.sent) === isOwn;

              return (
                <div 
                  key={message.id || messageIndex}
                  className={`message-group ${shouldGroupWithPrevious ? 'grouped' : ''}`}
                  style={{
                    marginBottom: shouldGroupWithNext ? '2px' : '8px'
                  }}
                >
                  <Message 
                    message={message} 
                    isOwn={isOwn}
                    conversationKey={conversationKey}
                  />
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Referência para scroll automático */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;

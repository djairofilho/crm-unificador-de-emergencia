import { Check, CheckCheck } from 'lucide-react';
import { formatTime, normalizeTimestamp, extractSenderFromGroupMessage, formatPhoneNumber, extractGroupInfo } from '../utils/formatters';

const Message = ({ message, isOwn, conversationKey }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={12} />;
      case 'delivered':
        return <CheckCheck size={12} />;
      case 'read':
        return <CheckCheck size={12} style={{ color: 'var(--status-read)' }} />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timestamp) => {
    const correctedTimestamp = normalizeTimestamp(timestamp);
    const date = new Date(correctedTimestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSenderInfo = () => {
    if (isOwn) return null;
    
    // Verificar se é uma conversa de grupo
    const groupInfo = extractGroupInfo(conversationKey);
    if (groupInfo && groupInfo.isGroup) {
      // Para grupos, o message.from contém o JID completo do remetente
      // Formato: 558589493359-1579300428@g.us:5511999999999@s.whatsapp.net
      if (message.from && message.from.includes('@g.us:')) {
        const senderNumber = extractSenderFromGroupMessage(message.from);
        if (senderNumber) {
          return {
            isGroup: true,
            senderNumber: formatPhoneNumber(senderNumber)
          };
        }
      }
    }
    
    return { isGroup: false };
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="message-text">
            {message.text}
          </div>
        );
      case 'image':
        return (
          <div>
            <div className="message-text">{message.text}</div>
            <div style={{ 
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              🖼️ Imagem
              {message.mediaData?.fileLength && (
                <span style={{ marginLeft: '8px' }}>
                  ({Math.round(message.mediaData.fileLength / 1024)}KB)
                </span>
              )}
            </div>
          </div>
        );
      case 'video':
        return (
          <div>
            <div className="message-text">{message.text}</div>
            <div style={{ 
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              🎥 Vídeo
              {message.mediaData?.fileLength && (
                <span style={{ marginLeft: '8px' }}>
                  ({Math.round(message.mediaData.fileLength / 1024)}KB)
                </span>
              )}
            </div>
          </div>
        );
      case 'audio':
        return (
          <div>
            <div className="message-text">{message.text}</div>
            <div style={{ 
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              🎵 Áudio
              {message.mediaData?.fileLength && (
                <span style={{ marginLeft: '8px' }}>
                  ({Math.round(message.mediaData.fileLength / 1024)}KB)
                </span>
              )}
            </div>
          </div>
        );
      case 'document':
        return (
          <div>
            <div className="message-text">{message.text}</div>
            <div style={{ 
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              📄 {message.mediaData?.fileName || 'Documento'}
              {message.mediaData?.fileLength && (
                <span style={{ marginLeft: '8px' }}>
                  ({Math.round(message.mediaData.fileLength / 1024)}KB)
                </span>
              )}
            </div>
          </div>
        );
      case 'sticker':
        return (
          <div>
            <div className="message-text">{message.text}</div>
            <div style={{ 
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              😀 Sticker
            </div>
          </div>
        );
      default:
        return (
          <div className="message-text">
            {message.text}
          </div>
        );
    }
  };

  const senderInfo = getSenderInfo();

  return (
    <div 
      className={`message-bubble ${isOwn ? 'sent' : 'received'}`}
      style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start' }}
    >
      {/* Nome do remetente em grupos */}
      {senderInfo && senderInfo.isGroup && (
        <div className="message-sender">
          {senderInfo.senderNumber}
        </div>
      )}
      
      {renderMessageContent()}
      
      <div className="message-time">
        <span>{formatMessageTime(message.timestamp)}</span>
        {isOwn && (
          <span className={`message-status ${message.status}`}>
            {getStatusIcon(message.status)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;

import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Search
} from 'lucide-react';
import { formatPhoneNumber, extractGroupInfo, formatDisplayName } from '../utils/formatters';

const ChatHeader = ({ 
  conversation, 
  isMobile, 
  onBack, 
  onCall, 
  onVideoCall 
}) => {
  const getInitials = (phoneNumber) => {
    if (!phoneNumber) return '?';
    const lastTwo = phoneNumber.slice(-2);
    return lastTwo;
  };

  const getDisplayInfo = (conversation) => {
    if (!conversation || !conversation.phoneNumber) {
      return { name: 'Selecione uma emergência', isGroup: false };
    }

    const groupInfo = extractGroupInfo(conversation.phoneNumber);
    if (groupInfo && groupInfo.isGroup) {
      // Para grupos, mostrar o número do grupo formatado
      return {
        name: formatPhoneNumber(groupInfo.groupNumber),
        isGroup: true,
        groupNumber: groupInfo.groupNumber
      };
    }

    return {
      name: formatDisplayName(conversation.phoneNumber, false),
      isGroup: false
    };
  };

  const handleCall = () => {
    if (onCall) onCall(conversation.phoneNumber);
  };

  const handleVideoCall = () => {
    if (onVideoCall) onVideoCall(conversation.phoneNumber);
  };

  const handleSearch = () => {
    // TODO: Implementar busca na conversa
    console.log('Buscar na conversa');
  };

  const handleMore = () => {
    // TODO: Implementar menu de opções
    console.log('Menu de opções');
  };



  const displayInfo = getDisplayInfo(conversation);

  if (!conversation) {
    return (
      <div className="chat-header">
        <div className="chat-header-left">
          {isMobile && (
            <button className="chat-back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="chat-contact-info">
            <div className="chat-contact-avatar">
              <span>?</span>
            </div>
            <div>
              <h3>Selecione uma emergência</h3>
              <div className="chat-contact-status">Escolha uma emergência para atender</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        {isMobile && (
          <button className="chat-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
        )}
        
        <div className="chat-contact-info">
          <div className="chat-contact-avatar">
            {displayInfo.isGroup ? 'GP' : getInitials(conversation.phoneNumber)}
          </div>
          <div>
            <h3>{displayInfo.name}</h3>
            <div className="chat-contact-status">
              {displayInfo.isGroup ? 'Grupo de emergência' : (conversation.lastMessageTime ? 'Emergência ativa' : 'Aguardando resposta')}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-header-actions">
        <button 
          className="chat-action-btn"
          onClick={handleSearch}
          title="Buscar"
        >
          <Search size={20} />
        </button>
        
        <button 
          className="chat-action-btn"
          onClick={handleCall}
          title="Ligar"
        >
          <Phone size={20} />
        </button>
        
        <button 
          className="chat-action-btn"
          onClick={handleVideoCall}
          title="Vídeo chamada"
        >
          <Video size={20} />
        </button>
        
        <button 
          className="chat-action-btn"
          onClick={handleMore}
          title="Mais opções"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

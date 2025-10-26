import { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  AlertTriangle, 
  Menu,
  Plus
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import ConversationItem from './ConversationItem';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ onConversationSelect, isMobile, onMenuClick }) => {
  const { getSortedConversations } = useChat();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = getSortedConversations();
  
  // Filtrar conversas por busca
  const filteredConversations = conversations.filter(conversation => 
    conversation.phoneNumber.includes(searchQuery) ||
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (phoneNumber) => {
    onConversationSelect(phoneNumber);
  };

  const handleNewChat = () => {
    // TODO: Implementar modal para novo chat
    console.log('Novo chat');
  };

  return (
    <div className="whatsapp-sidebar">
      {/* Header da Sidebar */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isMobile && (
            <button 
              className="sidebar-action-btn"
              onClick={onMenuClick}
            >
              <Menu size={20} />
            </button>
          )}
          <h2 className="sidebar-title">Emergências</h2>
        </div>
        
        <div className="sidebar-actions">
          <button className="sidebar-action-btn" onClick={handleNewChat}>
            <Plus size={20} />
          </button>
          <button className="sidebar-action-btn">
            <MoreVertical size={20} />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Barra de Busca */}
      <div style={{ 
        padding: '8px 16px', 
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-sidebar)'
      }}>
        <div style={{ 
          position: 'relative',
          backgroundColor: 'var(--input-bg)',
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Buscar emergências"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--input-text)',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="conversation-list">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.phoneNumber}
              conversation={conversation}
              isSelected={false} // TODO: Implementar seleção
              onClick={handleConversationClick}
            />
          ))
        ) : (
          <div className="empty-conversations">
            <AlertTriangle size={48} color="var(--text-muted)" />
            <h3>Nenhuma emergência</h3>
            <p>
              {searchQuery 
                ? 'Nenhuma emergência encontrada para sua busca'
                : 'Aguarde chamadas de emergência ou inicie uma nova'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

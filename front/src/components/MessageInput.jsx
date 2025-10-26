import { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Smile, 
  Send, 
  Mic,
  X
} from 'lucide-react';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // 5 linhas aproximadamente
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleAttach = () => {
    // TODO: Implementar anexo de arquivos
    console.log('Anexar arquivo');
  };

  const handleEmoji = () => {
    // TODO: Implementar seletor de emoji
    console.log('Seletor de emoji');
  };

  const handleVoice = () => {
    if (isRecording) {
      // Parar gravação
      setIsRecording(false);
      console.log('Parar gravação');
    } else {
      // Iniciar gravação
      setIsRecording(true);
      console.log('Iniciar gravação');
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', gap: '8px' }}>
        {/* Botão de anexo */}
        <button
          type="button"
          className="message-input-btn"
          onClick={handleAttach}
          disabled={disabled}
          title="Anexar arquivo"
        >
          <Paperclip size={20} />
        </button>

        {/* Campo de texto */}
        <div className="message-input-wrapper">
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder="Digite uma mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            style={{
              minHeight: '20px',
              maxHeight: '100px',
              resize: 'none',
              overflow: 'hidden'
            }}
          />
          
          {/* Botão de emoji */}
          <button
            type="button"
            className="message-input-btn"
            onClick={handleEmoji}
            disabled={disabled}
            title="Emoji"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Botão de enviar ou gravação */}
        {canSend ? (
          <button
            type="submit"
            className="message-send-btn"
            disabled={disabled}
            title="Enviar mensagem"
          >
            <Send size={16} />
          </button>
        ) : (
          <button
            type="button"
            className={`message-input-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoice}
            disabled={disabled}
            title={isRecording ? "Parar gravação" : "Gravar áudio"}
            style={{
              backgroundColor: isRecording ? '#ff4444' : 'transparent',
              color: isRecording ? 'white' : 'var(--text-secondary)'
            }}
          >
            {isRecording ? <X size={16} /> : <Mic size={20} />}
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;

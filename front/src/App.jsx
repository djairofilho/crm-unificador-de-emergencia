import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import QRScreen from './components/QRScreen';
import MainLayout from './components/MainLayout';
import './styles/variables.css';
import './styles/whatsapp-theme.css';

// Componente interno que usa o ChatContext
function AppContent({ connectionState, socketRef }) {
  const { updateConversation, addSentMessage } = useChat();

  useEffect(() => {
    if (!socketRef) return;

    // Listener para novas mensagens
    const handleNewMessage = (message) => {
      console.log('Nova mensagem recebida:', message);
      
      // Se for mensagem própria, usar o conversationKey como chave da conversa
      if (message.sent && message.from === 'me' && message.conversationKey) {
        updateConversation(message.conversationKey, message);
      } else {
        updateConversation(message.from, message);
      }
    };

    // Listener para mensagem enviada com sucesso
    const handleMessageSent = (result) => {
      console.log('Mensagem enviada:', result);
      // Não adicionar mensagem aqui pois ela será recebida via new-message do backend
      // Isso evita duplicação de mensagens próprias
    };

    // Listener para erros ao enviar mensagem
    const handleMessageError = (data) => {
      console.error('Erro ao enviar mensagem:', data.error);
      alert(`Erro ao enviar mensagem: ${data.error}`);
    };

    socketRef.on('new-message', handleNewMessage);
    socketRef.on('message-sent', handleMessageSent);
    socketRef.on('message-error', handleMessageError);

    return () => {
      socketRef.off('new-message', handleNewMessage);
      socketRef.off('message-sent', handleMessageSent);
      socketRef.off('message-error', handleMessageError);
    };
  }, [socketRef, updateConversation, addSentMessage]);

  // Função para enviar mensagem
  const handleSendMessage = (phoneNumber, messageText) => {
    if (!connectionState.isConnected) {
      alert('WhatsApp não está conectado');
      return;
    }

    if (!socketRef) {
      alert('Conexão com servidor não disponível');
      return;
    }

    const payload = {
      phoneNumber: phoneNumber.trim(),
      text: messageText.trim()
    };

    console.log('Enviando mensagem:', payload);
    socketRef.emit('send-message', payload);
  };

  // Renderizar tela baseada no estado de conexão
  if (connectionState.isConnected) {
    return <MainLayout onSendMessage={handleSendMessage} />;
  } else {
    return (
      <QRScreen 
        connectionState={connectionState}
        onConnected={() => console.log('WhatsApp conectado!')}
      />
    );
  }
}

function App() {
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    qrCode: null,
    phoneNumber: null,
    status: 'disconnected' // disconnected, connecting, qr_ready, connected
  });

  const [socketRef, setSocketRef] = useState(null);

  useEffect(() => {
    // Conectar ao backend via Socket.IO
    const socket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    setSocketRef(socket);

    // Listener para atualização do estado de conexão
    socket.on('connection-state', (state) => {
      console.log('Estado de conexão atualizado:', state);
      setConnectionState(state);
    });

    // Listener para QR code
    socket.on('qr-code', (qrCodeDataURL) => {
      console.log('QR code recebido');
      setConnectionState(prev => ({
        ...prev,
        qrCode: qrCodeDataURL,
        status: 'qr_ready'
      }));
    });

    // Listener para quando estiver conectado
    socket.on('whatsapp-connected', (data) => {
      console.log('WhatsApp conectado:', data);
      setConnectionState(prev => ({
        ...prev,
        isConnected: true,
        status: 'connected',
        phoneNumber: data.phoneNumber
      }));
    });

    // Listener para erros
    socket.on('error', (error) => {
      console.error('Erro do socket:', error);
    });

    // Listener para desconexão
    socket.on('disconnect', () => {
      console.log('Desconectado do servidor');
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

         return (
           <ThemeProvider>
             <ChatProvider>
               <AppContent 
                 connectionState={connectionState} 
                 socketRef={socketRef} 
               />
             </ChatProvider>
           </ThemeProvider>
         );
}

export default App;

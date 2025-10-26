import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys';
import qrcodeTerminal from 'qrcode-terminal';
import QRCode from 'qrcode';
import pino from 'pino';

let sock = null;
let io = null;
let connectionState = {
  isConnected: false,
  qrCode: null,
  phoneNumber: null,
  status: 'disconnected' // disconnected, connecting, qr_ready, connected
};

const logger = pino({ level: 'silent' });

export async function initWhatsApp(socketIO) {
  io = socketIO;
  
  try {
    await connectToWhatsApp();
  } catch (error) {
    console.error('Erro ao inicializar WhatsApp:', error);
  }
}

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    defaultQueryTimeoutMs: undefined,
  });

  // Handler de atualização de credenciais
  sock.ev.on('creds.update', saveCreds);

  // Handler de atualização de conexão
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // QR Code gerado
    if (qr) {
      console.log('\n========================================');
      console.log('QR CODE GERADO - Escaneie com WhatsApp:');
      console.log('========================================\n');
      
      // Mostrar no terminal
      qrcodeTerminal.generate(qr, { small: true });
      
      // Gerar QR code em base64 para o frontend
      try {
        const qrCodeDataURL = await QRCode.toDataURL(qr);
        connectionState.qrCode = qrCodeDataURL;
        connectionState.status = 'qr_ready';
        
        // Emitir para todos os clientes conectados
        if (io) {
          io.emit('qr-code', qrCodeDataURL);
          io.emit('connection-state', connectionState);
        }
        
        console.log('QR Code enviado para o frontend\n');
      } catch (err) {
        console.error('Erro ao gerar QR code:', err);
      }
    }

    // Estado de conexão mudou
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      
      console.log('\n========================================');
      console.log('Conexão fechada. Motivo:', lastDisconnect?.error?.message);
      console.log('Reconectar?', shouldReconnect);
      console.log('========================================\n');

      connectionState.isConnected = false;
      connectionState.qrCode = null;
      connectionState.status = 'disconnected';
      
      if (io) {
        io.emit('connection-state', connectionState);
      }

      if (shouldReconnect) {
        setTimeout(() => {
          console.log('Reconectando...');
          connectToWhatsApp();
        }, 3000);
      }
    } else if (connection === 'open') {
      console.log('\n========================================');
      console.log('✓ CONECTADO AO WHATSAPP COM SUCESSO!');
      console.log('========================================\n');
      
      connectionState.isConnected = true;
      connectionState.qrCode = null;
      connectionState.status = 'connected';
      connectionState.phoneNumber = sock.user?.id?.split(':')[0] || null;
      
      if (io) {
        io.emit('connection-state', connectionState);
        io.emit('whatsapp-connected', {
          phoneNumber: connectionState.phoneNumber
        });
      }
    } else if (connection === 'connecting') {
      console.log('Conectando ao WhatsApp...');
      connectionState.status = 'connecting';
      
      if (io) {
        io.emit('connection-state', connectionState);
      }
    }
  });

  // Handler de mensagens recebidas
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    console.log('\n========================================');
    console.log('📨 MENSAGEM RECEBIDA');
    console.log('========================================');
    console.log('Tipo:', type);
    console.log('Quantidade de mensagens:', messages.length);
    
    if (type === 'notify') {
      for (const message of messages) {
        console.log('\n--- Analisando mensagem ---');
        console.log('From me:', message.key.fromMe);
        console.log('Remote JID:', message.key.remoteJid);
        console.log('Message ID:', message.key.id);
        console.log('Timestamp:', message.messageTimestamp);
        
        // Processar mensagens de outros usuários e próprias
        if (message.message) {
          const isOwnMessage = message.key.fromMe;
          const from = isOwnMessage ? 'me' : message.key.remoteJid;
          const messageId = message.key.id;
          const timestamp = message.messageTimestamp;
          
          // Para mensagens próprias, usar o remoteJid como destino
          const conversationKey = isOwnMessage ? message.key.remoteJid : message.key.remoteJid;
          
          // Extrair texto da mensagem (suporta diferentes tipos)
          let text = '';
          let messageType = 'text';
          let mediaData = null;
          
          if (message.message.conversation) {
            text = message.message.conversation;
            messageType = 'text';
          } else if (message.message.extendedTextMessage) {
            text = message.message.extendedTextMessage.text;
            messageType = 'text';
          } else if (message.message.imageMessage) {
            text = message.message.imageMessage.caption || '[Imagem]';
            messageType = 'image';
            mediaData = {
              url: message.message.imageMessage.url,
              mimetype: message.message.imageMessage.mimetype,
              fileLength: message.message.imageMessage.fileLength
            };
          } else if (message.message.videoMessage) {
            text = message.message.videoMessage.caption || '[Vídeo]';
            messageType = 'video';
            mediaData = {
              url: message.message.videoMessage.url,
              mimetype: message.message.videoMessage.mimetype,
              fileLength: message.message.videoMessage.fileLength
            };
          } else if (message.message.audioMessage) {
            text = '[Áudio]';
            messageType = 'audio';
            mediaData = {
              url: message.message.audioMessage.url,
              mimetype: message.message.audioMessage.mimetype,
              fileLength: message.message.audioMessage.fileLength
            };
          } else if (message.message.documentMessage) {
            text = message.message.documentMessage.title || '[Documento]';
            messageType = 'document';
            mediaData = {
              url: message.message.documentMessage.url,
              mimetype: message.message.documentMessage.mimetype,
              fileName: message.message.documentMessage.fileName,
              fileLength: message.message.documentMessage.fileLength
            };
          } else if (message.message.stickerMessage) {
            text = '[Sticker]';
            messageType = 'sticker';
            mediaData = {
              url: message.message.stickerMessage.url,
              mimetype: message.message.stickerMessage.mimetype
            };
          }
          
          console.log('É mensagem própria:', isOwnMessage);
          console.log('Tipo da mensagem:', messageType);
          console.log('Texto extraído:', text);
          console.log('Dados de mídia:', mediaData);
          
          // Criar objeto da mensagem
          const messageData = {
            id: messageId,
            from,
            text,
            type: messageType,
            timestamp,
            mediaData,
            receivedAt: new Date().toISOString(),
            sent: isOwnMessage,
            status: isOwnMessage ? 'sent' : 'read',
            conversationKey: conversationKey
          };
          
          console.log('✓ Mensagem processada com sucesso');
          console.log('Dados finais:', messageData);
          
          // Emitir para o frontend
          if (io) {
            console.log('Emitindo new-message para frontend...');
            io.emit('new-message', messageData);
            console.log('✓ Evento new-message emitido');
          } else {
            console.log('❌ Socket.io não disponível');
          }
        } else {
          console.log('Mensagem ignorada (própria ou sem conteúdo)');
        }
      }
    }
    
    console.log('========================================\n');
  });
}

export function getConnectionState() {
  return connectionState;
}

export function getSocket() {
  return sock;
}

export async function sendMessage(phoneNumber, text) {
  console.log('\n========================================');
  console.log('📤 INICIANDO ENVIO DE MENSAGEM');
  console.log('========================================');
  console.log('Número:', phoneNumber);
  console.log('Mensagem:', text);
  console.log('Socket conectado:', sock ? 'Sim' : 'Não');
  console.log('WhatsApp conectado:', connectionState.isConnected);

  if (!sock) {
    console.error('❌ Erro: Socket não inicializado');
    throw new Error('Socket do WhatsApp não foi inicializado');
  }

  if (!connectionState.isConnected) {
    console.error('❌ Erro: WhatsApp não está conectado');
    throw new Error('WhatsApp não está conectado');
  }

  try {
    // Formatar o número de telefone para o padrão do WhatsApp
    let jid = phoneNumber;
    
    // Se não tiver @, adicionar o domínio do WhatsApp
    if (!phoneNumber.includes('@')) {
      jid = `${phoneNumber}@s.whatsapp.net`;
      console.log('JID formatado:', jid);
    }
    
    console.log('Enviando mensagem para JID:', jid);
    
    // Enviar a mensagem
    const result = await sock.sendMessage(jid, { text });
    
    console.log('✓ Mensagem enviada com sucesso!');
    console.log('Resultado:', result);
    console.log('========================================\n');
    
    return {
      success: true,
      message: 'Mensagem enviada com sucesso',
      to: phoneNumber,
      jid: jid,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:');
    console.error('Nome do erro:', error.name);
    console.error('Mensagem do erro:', error.message);
    console.error('Stack:', error.stack);
    console.log('========================================\n');
    throw error;
  }
}


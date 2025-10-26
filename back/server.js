import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initWhatsApp, getConnectionState, sendMessage } from './services/whatsapp.service.js';

const app = express();
const httpServer = createServer(app);

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Configurar Socket.io com CORS
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inicializar WhatsApp com Socket.io
initWhatsApp(io);

// Rotas básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/connection-state', (req, res) => {
  const state = getConnectionState();
  res.json(state);
});

app.post('/api/send-message', async (req, res) => {
  try {
    const { phoneNumber, text } = req.body;

    if (!phoneNumber || !text) {
      return res.status(400).json({
        success: false,
        message: 'Número de telefone e texto são obrigatórios'
      });
    }

    const result = await sendMessage(phoneNumber, text);
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao enviar mensagem'
    });
  }
});

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Enviar estado atual da conexão
  const state = getConnectionState();
  socket.emit('connection-state', state);

  // Listener para enviar mensagem via socket
  socket.on('send-message', async (data) => {
    console.log('\n🔔 Evento recebido: send-message');
    console.log('Cliente ID:', socket.id);
    console.log('Dados recebidos:', data);

    try {
      const { phoneNumber, text } = data;
      
      if (!phoneNumber || !text) {
        console.error('❌ Validação falhou: campos obrigatórios ausentes');
        socket.emit('message-error', {
          error: 'Número de telefone e texto são obrigatórios'
        });
        return;
      }

      console.log('✓ Validação passou');
      console.log('Chamando sendMessage...');
      
      const result = await sendMessage(phoneNumber, text);
      
      console.log('✓ sendMessage executado com sucesso');
      console.log('Resultado:', result);
      console.log('Emitindo message-sent para cliente...');
      
      socket.emit('message-sent', result);
      
      console.log('✓ Evento message-sent emitido\n');
    } catch (error) {
      console.error('❌ Erro na execução:');
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      socket.emit('message-error', {
        error: error.message || 'Erro ao enviar mensagem'
      });
      console.log('✓ Evento message-error emitido\n');
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Frontend: http://localhost:5173`);
});


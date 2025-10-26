# 📊 Arquitetura do Sistema WhatsChain

## Estrutura de Diretórios

```
whatschain/
│
├── 📁 back/                          # Backend Node.js
│   ├── 📁 services/
│   │   └── whatsapp.service.js      # Lógica Baileys + Socket.IO
│   ├── server.js                    # Servidor Express
│   ├── package.json
│   ├── .gitignore
│   └── 📁 auth_info_baileys/        # Sessão WhatsApp (auto-gerado)
│
├── 📁 front/                         # Frontend React
│   ├── 📁 src/
│   │   ├── App.jsx                  # Componente principal
│   │   ├── App.css                  # Estilos
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── 📜 README.md                      # Documentação completa
```

## Fluxo de Comunicação

```
┌─────────────────┐         Socket.IO         ┌─────────────────┐
│                 │◄──────────────────────────►│                 │
│   Frontend      │    WebSocket (Port 5173)   │   Backend       │
│   (React)       │                            │   (Express)     │
│                 │  Eventos:                  │                 │
│  - Exibe QR     │  • qr-code                 │  - Gera QR      │
│  - Status       │  • connection-state        │  - Conecta WA   │
│  - Mensagens    │  • whatsapp-connected      │  - Socket.IO    │
│                 │  • new-message             │                 │
└─────────────────┘                            └────────┬────────┘
                                                        │
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │     Baileys     │
                                               │  (WhatsApp API) │
                                               │                 │
                                               │ - Multi Auth    │
                                               │ - QR Generator  │
                                               │ - Message Handle│
                                               └─────────────────┘
```

## Eventos Socket.IO

### Backend → Frontend

| Evento | Dados | Descrição |
|--------|-------|-----------|
| `qr-code` | `string` (base64) | QR code para escanear |
| `connection-state` | `{ status, isConnected, qrCode, phoneNumber }` | Estado atual da conexão |
| `whatsapp-connected` | `{ phoneNumber }` | WhatsApp conectado com sucesso |
| `new-message` | `{ from, text, timestamp }` | Nova mensagem recebida |

### Frontend → Backend

| Evento | Dados | Descrição |
|--------|-------|-----------|
| `connect` | - | Cliente conectou ao Socket.IO |
| `disconnect` | - | Cliente desconectou |

## Estados da Aplicação

```
Fluxo de Estados:

disconnected
    ↓
connecting (Baileys iniciando)
    ↓
qr_ready (QR code gerado)
    ↓ (usuário escaneia)
connected (WhatsApp online)
    ↓ (se desconectar)
disconnected → reconecta automaticamente
```

## Tecnologias e Versões

### Backend
- **@whiskeysockets/baileys**: ^6.7.8
- **express**: ^4.18.2
- **socket.io**: ^4.7.2
- **cors**: ^2.8.5
- **qrcode-terminal**: ^0.12.0
- **qrcode**: ^1.5.3
- **pino**: ^8.16.2

### Frontend
- **react**: ^19.1.1
- **react-dom**: ^19.1.1
- **socket.io-client**: ^4.7.5
- **qrcode**: ^1.5.4
- **vite**: ^7.1.7

## Portas Utilizadas

- **Backend**: 3001
- **Frontend**: 5173 (Vite default)

## Segurança

### Dados Sensíveis
- ⚠️ `auth_info_baileys/` - Contém credenciais WhatsApp
- ✓ Incluído no `.gitignore`
- ✓ NÃO commitar ou compartilhar

### CORS
- Configurado para `localhost:5173`
- Produção: ajustar para domínio real

## Performance

### Reconexão Automática
- Timeout: 3 segundos
- Não perde sessão salva
- QR apenas se fizer logout manual

### Socket.IO
- Transports: WebSocket + Polling
- Auto-reconnect habilitado
- Eventos otimizados

## Expansões Futuras

- [ ] Enviar mensagens
- [ ] Listar conversas
- [ ] Histórico de mensagens
- [ ] Upload de mídias
- [ ] Status de leitura
- [ ] Grupos
- [ ] Múltiplas sessões
- [ ] Autenticação de usuários
- [ ] Banco de dados
- [ ] Deploy em nuvem


# WhatsApp Chain

Um sistema completo de chat do WhatsApp com interface moderna e funcionalidades avançadas.

## 🚀 Funcionalidades

- **Interface WhatsApp-like**: Design moderno inspirado no WhatsApp Web
- **Conexão Real**: Integração com WhatsApp usando Baileys
- **Tempo Real**: Comunicação via Socket.IO
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Temas**: Suporte a tema claro e escuro
- **QR Code**: Autenticação via QR Code
- **Mensagens**: Suporte a texto, imagens, vídeos, áudios e documentos

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.IO** - Comunicação em tempo real
- **Baileys** - Biblioteca WhatsApp
- **QRCode** - Geração de QR codes

### Frontend
- **React** - Biblioteca de interface
- **Vite** - Build tool
- **Socket.IO Client** - Cliente WebSocket
- **Lucide React** - Ícones
- **CSS Variables** - Sistema de temas

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Backend
```bash
cd back
npm install
npm start
```

### Frontend
```bash
cd front
npm install
npm run dev
```

## 🚀 Como Usar

1. **Inicie o Backend**:
   ```bash
   cd back
   npm start
   ```
   O servidor rodará na porta 3001

2. **Inicie o Frontend**:
   ```bash
   cd front
   npm run dev
   ```
   O frontend rodará na porta 5173

3. **Conecte o WhatsApp**:
   - Acesse http://localhost:5173
   - Escaneie o QR Code com seu WhatsApp
   - Comece a usar!

## 📁 Estrutura do Projeto

```
whatschain/
├── back/                    # Backend Node.js
│   ├── services/           # Serviços (WhatsApp, etc.)
│   ├── auth_info_baileys/  # Dados de autenticação
│   └── server.js           # Servidor principal
├── front/                  # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Contextos (Chat, Theme)
│   │   ├── styles/         # Estilos CSS
│   │   └── utils/          # Utilitários
│   └── public/               # Arquivos públicos
└── README.md               # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` no diretório `back/`:

```env
PORT=3001
NODE_ENV=development
```

### CORS
O CORS está configurado para `http://localhost:5173`. Para produção, ajuste no arquivo `server.js`.

## 📱 Funcionalidades Detalhadas

### Chat
- ✅ Lista de conversas
- ✅ Envio e recebimento de mensagens
- ✅ Suporte a diferentes tipos de mídia
- ✅ Status de mensagens (enviado, entregue, lido)
- ✅ Interface responsiva

### Autenticação
- ✅ QR Code para autenticação
- ✅ Persistência de sessão
- ✅ Reconexão automática

### Interface
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Animações suaves
- ✅ Ícones modernos

## 🐛 Solução de Problemas

### QR Code não aparece
- Verifique se o backend está rodando
- Limpe o cache do navegador
- Verifique o console para erros

### Mensagens não chegam
- Verifique a conexão com o WhatsApp
- Confirme se o QR Code foi escaneado
- Verifique os logs do backend

### Erro de CORS
- Ajuste a configuração de CORS no `server.js`
- Verifique se as portas estão corretas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Djairo Filho**
- GitHub: [@djairofilho](https://github.com/djairofilho)

## 🙏 Agradecimentos

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca WhatsApp
- [React](https://reactjs.org/) - Biblioteca de interface
- [Socket.IO](https://socket.io/) - Comunicação em tempo real
- [Lucide](https://lucide.dev/) - Ícones

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

// Normalizar timestamp (converter segundos para milissegundos se necessário)
export const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return null;
  // Se o timestamp for menor que 10 bilhões, provavelmente está em segundos
  return timestamp < 10000000000 ? timestamp * 1000 : timestamp;
};

// Formatação de timestamps
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const correctedTimestamp = normalizeTimestamp(timestamp);
  const date = new Date(correctedTimestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Se for hoje
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // Se for ontem
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  }
  
  // Se for esta semana
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (messageDate > weekAgo) {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short' 
    });
  }
  
  // Mais antigo
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  });
};

// Formatação de data para divisores de mensagem
export const formatDate = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Se for hoje
  if (messageDate.getTime() === today.getTime()) {
    return 'Hoje';
  }
  
  // Se for ontem
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  }
  
  // Se for esta semana
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (messageDate > weekAgo) {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
  
  // Mais antigo
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Formatação de número de telefone
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remover caracteres não numéricos
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Se começar com 55 (Brasil)
  if (cleaned.startsWith('55')) {
    const withoutCountryCode = cleaned.slice(2);
    
    // Se tiver 11 dígitos (DDD + 9 dígitos)
    if (withoutCountryCode.length === 11) {
      const ddd = withoutCountryCode.slice(0, 2);
      const firstPart = withoutCountryCode.slice(2, 7);
      const secondPart = withoutCountryCode.slice(7);
      return `+55 (${ddd}) ${firstPart}-${secondPart}`;
    }
    
    // Se tiver 10 dígitos (DDD + 8 dígitos)
    if (withoutCountryCode.length === 10) {
      const ddd = withoutCountryCode.slice(0, 2);
      const firstPart = withoutCountryCode.slice(2, 6);
      const secondPart = withoutCountryCode.slice(6);
      return `+55 (${ddd}) ${firstPart}-${secondPart}`;
    }
  }
  
  // Formato genérico
  if (cleaned.length >= 10) {
    const ddd = cleaned.slice(-10, -8);
    const number = cleaned.slice(-8);
    const firstPart = number.slice(0, 4);
    const secondPart = number.slice(4);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }
  
  return phoneNumber;
};

// Extrair apenas números do telefone
export const extractPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/\D/g, '');
};

// Validar número de telefone brasileiro
export const isValidBrazilianPhone = (phoneNumber) => {
  const cleaned = extractPhoneNumber(phoneNumber);
  
  // Número com código do país (55)
  if (cleaned.startsWith('55')) {
    const withoutCountryCode = cleaned.slice(2);
    return withoutCountryCode.length === 10 || withoutCountryCode.length === 11;
  }
  
  // Número sem código do país
  return cleaned.length === 10 || cleaned.length === 11;
};

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// Formatação de duração de áudio
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primeira letra
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Gerar iniciais do nome
export const getInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Verificar se é URL
export const isUrl = (text) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

// Extrair URLs do texto
export const extractUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// Formatação de status de mensagem
export const getMessageStatusText = (status) => {
  switch (status) {
    case 'sent':
      return 'Enviado';
    case 'delivered':
      return 'Entregue';
    case 'read':
      return 'Lido';
    default:
      return 'Enviando...';
  }
};

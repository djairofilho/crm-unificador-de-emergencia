import { useState, useEffect } from 'react';
import { AlertTriangle, Smartphone, QrCode } from 'lucide-react';

const QRScreen = ({ connectionState, onConnected }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Mostrar instruções após 3 segundos se não estiver conectado
    const timer = setTimeout(() => {
      if (!connectionState.isConnected && connectionState.status !== 'qr_ready') {
        setShowInstructions(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [connectionState.isConnected, connectionState.status]);

  const getStatusText = () => {
    switch (connectionState.status) {
      case 'connected':
        return 'Conectado com sucesso!';
      case 'qr_ready':
        return 'Escaneie o QR code com seu WhatsApp';
      case 'connecting':
        return 'Conectando ao WhatsApp...';
      default:
        return 'Iniciando conexão...';
    }
  };

  const getStatusColor = () => {
    switch (connectionState.status) {
      case 'connected':
        return '#00A884';
      case 'qr_ready':
        return '#25D366';
      case 'connecting':
        return '#FFA500';
      default:
        return '#8696A0';
    }
  };

  return (
    <div className="qr-screen">
      {/* Logo do Sistema de Emergência */}
      <div className="qr-logo">
        <AlertTriangle size={40} />
      </div>

      {/* Título */}
      <h1 className="qr-title">CRM Emergência Unificada</h1>
      <p className="qr-subtitle">
        Sistema de atendimento de emergências
      </p>

      {/* Status */}
      <div style={{ 
        color: getStatusColor(), 
        fontSize: '16px', 
        fontWeight: '500',
        marginBottom: '24px'
      }}>
        {getStatusText()}
      </div>

      {/* QR Code ou Loading */}
      {connectionState.status === 'qr_ready' && connectionState.qrCode ? (
        <div className="qr-container">
          <img 
            src={connectionState.qrCode} 
            alt="QR Code do WhatsApp"
            className="qr-code"
          />
        </div>
      ) : connectionState.status === 'connected' ? (
        <div className="qr-container" style={{ 
          backgroundColor: 'var(--primary-color)', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <AlertTriangle size={48} />
          <div style={{ fontSize: '18px', fontWeight: '500' }}>
            Sistema Ativo!
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {connectionState.phoneNumber}
          </div>
        </div>
      ) : (
        <div className="qr-container">
          <div className="qr-loading">
            <div className="qr-spinner"></div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Iniciando sistema de emergência...
            </div>
          </div>
        </div>
      )}

      {/* Instruções */}
      {connectionState.status === 'qr_ready' && (
        <div className="qr-instructions">
          <h3>Para conectar seu WhatsApp:</h3>
          <ol>
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque em <strong>Menu</strong> ou <strong>Configurações</strong></li>
            <li>Toque em <strong>Aparelhos conectados</strong></li>
            <li>Toque em <strong>Conectar um aparelho</strong></li>
            <li>Aponte seu celular para esta tela para escanear o QR code</li>
          </ol>
        </div>
      )}

      {/* Instruções de fallback */}
      {showInstructions && connectionState.status === 'disconnected' && (
        <div className="qr-instructions">
          <h3>Como conectar:</h3>
          <ol>
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque em <strong>Menu</strong> ou <strong>Configurações</strong></li>
            <li>Toque em <strong>Aparelhos conectados</strong></li>
            <li>Toque em <strong>Conectar um aparelho</strong></li>
            <li>Escaneie o QR code que aparecerá aqui</li>
          </ol>
        </div>
      )}

      {/* Informações adicionais */}
      <div style={{ 
        marginTop: '32px', 
        fontSize: '12px', 
        color: 'var(--text-muted)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <p>
          Sistema de emergência unificado ativo. 
          Todas as chamadas de emergência serão direcionadas para este sistema.
        </p>
      </div>
    </div>
  );
};

export default QRScreen;

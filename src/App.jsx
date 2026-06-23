import React, { useState, useCallback, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Hooks personalizados
import { useIntentDetection } from './hooks/useIntentDetection';
import { useTheme } from './hooks/useTheme';
import { useGuideNavigation } from './hooks/useGuideNavigation';
import { useChat } from './hooks/useChat';
import { useFileUpload } from './hooks/useFileUpload';
import { useProcessContext } from './hooks/useContext';

// Componentes
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import SettingsModal from './components/SettingsModal';

// Constantes
import { CONFIG } from './constants/config';
import { THEME_COLORS } from './constants/themes';
import { VISUAL_GUIDES } from './constants/guides';
import { INTENTS } from './constants/intents';

// Utils
import { copyToClipboard } from './utils/textUtils';
import { detectIntent, hasConfirmedVoBo, isRequestForBothEmails } from './utils/intentUtils';
import { generateBothVoBoEmails, generateDefaultResponse } from './utils/responseUtils';

// Configurar PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function App() {
  // Estados globales
  const [viewMode, setViewMode] = useState('full');
  const [showSettings, setShowSettings] = useState(false);
  const [visualQuestion, setVisualQuestion] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const [serviceStatus] = useState(CONFIG.DEFAULT_SERVICE_STATUS);

  // Hooks personalizados
  const { theme, setTheme, currentTheme, skinTone, setSkinTone, currentAvatar, availableThemes, availableSkinTones } = useTheme();
  const { detect, generateResponse } = useIntentDetection();
  const { guideActive, currentGuideType, guideStep, visualGuide, visualStep, startGuide, nextStep, previousStep, openVisualGuide, closeVisualGuide, nextVisualStep, previousVisualStep } = useGuideNavigation();
  const { messages, isTyping, chatHistory, message, setMessage, addUserMessage, addDianaMessage, simulateTyping } = useChat();
  const { uploadedFiles, pdfText, imageAnalysis, handleFileUpload } = useFileUpload();
  const { contexto, updateContext } = useProcessContext();

  // ============================================
  // ESTILOS
  // ============================================

  const styles = useMemo(() => ({
    page: {
      minHeight: viewMode === 'floating' ? '720px' : '100vh',
      width: viewMode === 'floating' ? '460px' : '100%',
      height: viewMode === 'floating' ? '720px' : 'auto',
      position: viewMode === 'floating' ? 'fixed' : 'relative',
      right: viewMode === 'floating' ? '24px' : 'auto',
      bottom: viewMode === 'floating' ? '24px' : 'auto',
      borderRadius: viewMode === 'floating' ? '28px' : '0px',
      overflow: 'hidden',
      background: currentTheme.bg,
      color: currentTheme.text,
      fontFamily: 'Inter, Arial, sans-serif',
      display: 'flex',
      zIndex: 900,
      boxShadow: viewMode === 'floating' ? `0 0 45px ${currentTheme.accent}55` : 'none'
    },
    sidebar: {
      width: '290px',
      background: currentTheme.sidebar,
      borderRight: `1px solid ${currentTheme.accent}`,
      padding: '24px'
    },
    main: {
      flex: 1,
      padding: '28px',
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: '24px'
    },
    card: {
      background: currentTheme.card,
      border: `1px solid ${currentTheme.accent}`,
      borderRadius: '24px',
      padding: '22px',
      boxShadow: `0 0 30px ${currentTheme.accent}33`,
      color: currentTheme.text
    },
    cyan: { color: currentTheme.accent },
    button: {
      background: currentTheme.accent,
      color: 'black',
      border: 'none',
      borderRadius: '16px',
      padding: '14px 22px',
      fontWeight: '800',
      cursor: 'pointer'
    },
    ghostButton: {
      background: '#0b2747',
      color: 'white',
      border: `1px solid ${currentTheme.accent}`,
      borderRadius: '16px',
      padding: '12px 16px',
      cursor: 'pointer'
    },
    input: {
      background: '#0b2747',
      color: 'white',
      border: `1px solid ${currentTheme.accent}`,
      borderRadius: '14px',
      outline: 'none',
      padding: '14px'
    }
  }), [viewMode, currentTheme]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSendMessage = useCallback((text = message) => {
    if (!text.trim()) return;

    const userText = text;
    const intent = detectIntent(userText);

    // Agregar mensaje del usuario
    addUserMessage(userText);
    setMessage('');
    setVisualQuestion('');
    setLastAction(intent);

    // Actualizar contexto
    updateContext({
      ultimaAccion: userText,
      procesoActual: intent !== INTENTS.GENERAL ? intent : contexto.procesoActual,
      pasoActual: intent
    });

    // Manejar solicitud de correos para ambos
    if (isRequestForBothEmails(userText)) {
      simulateTyping(() => {
        addDianaMessage(generateBothVoBoEmails());
      });
      return;
    }

    // Manejar confirmación de Vo.Bo.
    if (hasConfirmedVoBo(userText)) {
      simulateTyping(() => {
        addDianaMessage(`Perfecto 👌\n\nComo ya tienes el Vo.Bo., el siguiente paso es:\n\n1. Adjuntar la evidencia.\n2. Crear o actualizar la solicitud en Jira / Helix.\n3. Agregar comentario con datos del usuario.\n4. Validar que el role y profile sean correctos.\n5. Dar seguimiento hasta confirmación.\n\n¿Quieres que te genere el comentario Helix o el ticket Jira?`);
      });
      return;
    }

    // Generar respuesta según intención
    const respuestaDiana = generateResponse(userText);

    simulateTyping(() => {
      addDianaMessage(respuestaDiana);
    });
  }, [message, addUserMessage, setMessage, addDianaMessage, simulateTyping, generateResponse, updateContext, contexto]);

  const handleCopyMessage = useCallback(async (text) => {
    const result = await copyToClipboard(text);
    if (result.success) {
      alert(result.message);
    }
  }, []);

  const handleToggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'floating' ? 'full' : 'floating');
  }, []);

  const handleOpenDocument = useCallback((type) => {
    const link = CONFIG.DOCUMENT_LINKS[type];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // ============================================
  // ITEMS DE MENÚ
  // ============================================

  const menuItems = useMemo(() => [
    '💬 Chat',
    '🏠 Inicio',
    '📚 Conocimiento',
    '📘 Guías paso a paso',
    '⚡ Generadores',
    '🔐 IAM / Accesos',
    '🧾 Jira / Helix',
    '🖥️ VPN / Citrix',
    '🚨 Impedimentos',
    '📊 Analysis 2.0'
  ], []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <style>
        {`
          @keyframes pulseDiana {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px ${currentTheme.glow}); }
            50% { transform: scale(1.04); filter: drop-shadow(0 0 28px ${currentTheme.glow}); }
            100% { transform: scale(1); filter: drop-shadow(0 0 10px ${currentTheme.glow}); }
          }

          @media (max-width: 900px) {
            .diana-layout { flex-direction: column !important; }
            .diana-sidebar { width: auto !important; }
            .diana-main { display: block !important; padding: 14px !important; }
            .diana-right-panel { margin-top: 18px !important; }
            .diana-hero { flex-direction: column !important; text-align: center !important; }
          }
        `}
      </style>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999,
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          border: `1px solid ${currentTheme.accent}`,
          background: '#061428',
          color: currentTheme.accent,
          fontSize: '22px',
          cursor: 'pointer'
        }}
      >
        ⚙️
      </button>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={setTheme}
        skinTone={skinTone}
        onSkinToneChange={setSkinTone}
        viewMode={viewMode}
        onViewModeToggle={handleToggleViewMode}
        currentTheme={currentTheme}
        styles={styles}
      />

      <div className="diana-layout" style={styles.page}>
        {/* Sidebar */}
        <Sidebar
          avatar={currentAvatar}
          currentTheme={currentTheme}
          chatHistory={chatHistory}
          styles={styles}
          menuItems={menuItems}
        />

        {/* Main Content */}
        <main className="diana-main" style={styles.main}>
          {/* Visual Guide Overlay */}
          {visualGuide && (
            <div
              style={{
                position: 'fixed',
                top: '90px',
                right: '430px',
                width: '560px',
                maxHeight: '82vh',
                overflowY: 'auto',
                zIndex: 997,
                ...styles.card
              }}
            >
              <button
                onClick={closeVisualGuide}
                style={{
                  float: 'right',
                  background: 'transparent',
                  color: currentTheme.text,
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

              <h2 style={styles.cyan}>📘 {visualGuide.titulo}</h2>
              <p>{visualGuide.descripcion}</p>

              <div
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  background: '#0b2747',
                  border: `1px solid ${currentTheme.accent}`,
                  color: 'white'
                }}
              >
                <strong style={styles.cyan}>
                  Paso {visualStep + 1} de {visualGuide.pasos.length}
                </strong>
                <p>{visualGuide.pasos[visualStep].texto}</p>

                <iframe
                  src={visualGuide.pasos[visualStep].pdf}
                  title="Demostración PDF"
                  style={{
                    width: '100%',
                    height: '420px',
                    borderRadius: '16px',
                    border: `2px solid ${currentTheme.accent}`,
                    marginTop: '10px',
                    background: 'white'
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#061428',
                  border: `1px solid ${currentTheme.accent}`,
                  color: 'white'
                }}
              >
                <strong style={styles.cyan}>🤖 ¿Tienes dudas sobre este paso?</strong>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                  Escríbeme y con gusto te ayudo.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input
                    value={visualQuestion}
                    onChange={(e) => setVisualQuestion(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    style={{ flex: 1, padding: '12px', ...styles.input }}
                  />
                  <button onClick={() => handleSendMessage(visualQuestion)} style={styles.button}>
                    ➤
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button onClick={previousVisualStep} style={styles.ghostButton}>
                  ← Anterior
                </button>
                <button onClick={nextVisualStep} style={styles.button}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Main Section */}
          <section>
            {/* Hero Card */}
            <div style={{ ...styles.card, marginBottom: '22px' }}>
              <div className="diana-hero" style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
                <img
                  src={currentAvatar}
                  alt="Diana avatar"
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: `0 0 45px ${currentTheme.glow}`,
                    animation: 'pulseDiana 2.4s infinite ease-in-out'
                  }}
                />
                <div>
                  <h1 style={{ fontSize: '44px', margin: 0 }}>
                    👋 Hola, soy <span style={styles.cyan}>Diana</span>
                  </h1>
                  <p style={{ fontSize: '18px', color: '#cbd5e1' }}>
                    Tu asistente inteligente BBVA para procesos, accesos, soporte y generación automática.
                  </p>
                  <div style={{ color: '#86efac' }}>● Diana Online</div>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onCopyMessage={handleCopyMessage}
              onGuideStart={startGuide}
              onGuideNext={nextStep}
              currentTheme={currentTheme}
              styles={styles}
            />

            {/* Input Area */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
              <label style={{ ...styles.ghostButton, display: 'inline-block', cursor: 'pointer' }}>
                📎 Adjuntar
                <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Escribe tu mensaje..."
                style={{ flex: 1, padding: '18px', ...styles.input }}
              />

              <button onClick={() => handleSendMessage()} style={styles.button}>
                Enviar
              </button>
            </div>
          </section>

          {/* Right Panel */}
          <RightPanel
            currentTheme={currentTheme}
            styles={styles}
            onQuickAction={handleSendMessage}
            onOpenGuide={openVisualGuide}
            onOpenDocument={handleOpenDocument}
            pdfText={pdfText}
            imageAnalysis={imageAnalysis}
            uploadedFiles={uploadedFiles}
            serviceStatus={serviceStatus}
            lastAction={lastAction}
            contexto={contexto}
          />
        </main>
      </div>
    </>
  );
}
import React from 'react';

export default function RightPanel({
  currentTheme,
  styles,
  onQuickAction,
  onOpenGuide,
  onOpenDocument,
  pdfText,
  imageAnalysis,
  uploadedFiles,
  serviceStatus,
  lastAction,
  contexto
}) {
  const quickActions = [
    'Necesito dar de alta un usuario en Teradata',
    'Hazme el correo VoBo',
    'Tengo error VPN',
    'Tengo bloqueo en Citrix',
    'Necesito formato DML',
    'Necesito clonar plantilla IAM'
  ];

  return (
    <aside className="diana-right-panel">
      <div style={{ ...styles.card, marginBottom: '18px' }}>
        <h3 style={styles.cyan}>⚡ Acciones rápidas</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => onQuickAction(action)}
              style={styles.ghostButton}
            >
              {action}
            </button>
          ))}

          <button
            onClick={() => onOpenGuide('teradata')}
            style={styles.ghostButton}
          >
            🖼️ Ver guía visual Teradata
          </button>
          <button
            onClick={() => onOpenGuide('vpn')}
            style={styles.ghostButton}
          >
            🖼️ Ver acceso Teradata por Citrix
          </button>
          <button
            onClick={() => onOpenGuide('iam')}
            style={styles.ghostButton}
          >
            🖼️ Ver guía visual IAM
          </button>
          <button
            onClick={() => onOpenDocument('vpn')}
            style={styles.ghostButton}
          >
            📘 Abrir guía Citrix
          </button>
          <button
            onClick={() => onOpenDocument('teradata')}
            style={styles.ghostButton}
          >
            📘 Abrir manual Teradata
          </button>
          <button
            onClick={() => onOpenDocument('dml')}
            style={styles.ghostButton}
          >
            📄 Abrir formato DML
          </button>
        </div>
      </div>

      <div style={{ ...styles.card, marginBottom: '18px' }}>
        <h3 style={styles.cyan}>📌 Generadores</h3>
        {['Correo VoBo', 'Comentario Helix', 'Historia Jira', 'Formato DML', 'Plantilla IAM'].map(
          (g) => (
            <button
              key={g}
              onClick={() => onQuickAction(g)}
              style={{ ...styles.ghostButton, marginBottom: '8px', width: '100%' }}
            >
              {g}
            </button>
          )
        )}
      </div>

      <div style={{ ...styles.card, marginBottom: '18px' }}>
        <h3 style={styles.cyan}>📂 Archivos adjuntos</h3>

        {pdfText && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              borderRadius: '14px',
              background: '#061428',
              border: `1px solid ${currentTheme.accent}`,
              whiteSpace: 'pre-wrap',
              color: 'white'
            }}
          >
            {pdfText}
          </div>
        )}

        {imageAnalysis && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              borderRadius: '14px',
              background: '#061428',
              border: `1px solid ${currentTheme.accent}`,
              whiteSpace: 'pre-wrap',
              color: 'white'
            }}
          >
            {imageAnalysis}
          </div>
        )}

        {uploadedFiles.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No hay archivos cargados.</p>
        ) : (
          uploadedFiles.map((file, index) => (
            <a
              key={index}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.ghostButton,
                display: 'block',
                marginBottom: '8px',
                textDecoration: 'none'
              }}
            >
              <strong>{file.nombre}</strong>
              <br />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{file.tamaño}</span>
            </a>
          ))
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cyan}>📊 Estado de servicios</h3>

        {Object.entries(serviceStatus).map(([servicio, estado]) => {
          const color =
            estado === 'operativo' ? '#22c55e' : estado === 'degradado' ? '#facc15' : '#ef4444';
          const icono = estado === 'operativo' ? '🟢' : estado === 'degradado' ? '🟡' : '🔴';

          return (
            <div
              key={servicio}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '12px',
                background: '#0b2747',
                border: `1px solid ${color}`,
                color: 'white'
              }}
            >
              <span style={{ textTransform: 'uppercase' }}>{servicio}</span>
              <span style={{ color }}>
                {icono} {estado}
              </span>
            </div>
          );
        })}

        {lastAction && (
          <div
            style={{
              marginTop: '14px',
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(56,189,248,.08)',
              border: `1px solid ${currentTheme.accent}`
            }}
          >
            <strong style={styles.cyan}>Última acción:</strong>
            <br />
            {lastAction}
          </div>
        )}

        {contexto.procesoActual && (
          <div
            style={{
              marginTop: '14px',
              padding: '12px',
              borderRadius: '14px',
              background: '#061428',
              border: `1px solid ${currentTheme.accent}`
            }}
          >
            <strong style={styles.cyan}>📋 Estado del proceso</strong>

            <br />
            <br />

            <strong>Proceso:</strong>
            <br />
            {contexto.procesoActual}

            <br />
            <br />

            <strong>Paso actual:</strong>
            <br />
            {contexto.pasoActual || 'Pendiente'}

            <br />
            <br />

            <div>{contexto.estadoVoBo === 'completado' ? '✅' : '⬜'} Vo.Bo.</div>

            <div>{contexto.estadoJira === 'completado' ? '✅' : '⬜'} Jira</div>

            <div>{contexto.estadoHelix === 'completado' ? '✅' : '⬜'} Helix</div>

            <div>{contexto.estadoCitrix === 'completado' ? '✅' : '⬜'} Citrix</div>
          </div>
        )}
      </div>
    </aside>
  );
}

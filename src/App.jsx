import React, { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [skinTone, setSkinTone] = useState("Original");
  const [theme, setTheme] = useState("BBVA Premium");
  const [guideActive, setGuideActive] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: "diana","Hola diana", "necesito que me ayudes en algo"
      text:
        "en que te puedo ayudar"
        "Hola 👋 Soy Diana, tu copiloto inteligente BBVA. Estoy aquí para ayudarte con procesos, soporte, accesos, formatos, Jira, Helix, VPN, Citrix, IAM y Teradata."
    }
  ]);

  const avatars = {
  "Original": "/diana-avatar.png",
  "Moreno claro": "/diana-avatar-morena.png",
  "Claro": "/diana-avatar-clara.png"
};

const avatar = avatars[skinTone];

  const themeColors = {
    "BBVA Premium": {
      bg: "linear-gradient(135deg,#020817,#061428,#082f49)",
      accent: "#38bdf8",
      glow: "#38bdf8"
    },
    
    "Oscuro Profesional": {
      bg: "linear-gradient(135deg,#000000,#111827,#1f2937)",
      accent: "#60a5fa",
      glow: "#60a5fa"
    },
    
    "Turquesa Tecnológico": {
      bg: "linear-gradient(135deg,#022c22,#064e3b,#0f766e)",
      accent: "#2dd4bf",
      glow: "#2dd4bf"
    },
    
    "Púrpura Creativo": {
      bg: "linear-gradient(135deg,#1e032e,#3b0764,#581c87)",
      accent: "#c084fc",
      glow: "#c084fc"
    }
  };

  const currentTheme = themeColors[theme];

  function responder(txt) {
    const t = txt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

   if (
     (t.includes("correo") || t.includes("mensaje") || t.includes("generame") || t.includes("genérame")) &&
     (t.includes("vobo") || t.includes("vo.bo") || t.includes("vo.bo.") || t.includes("vo bo"))
   ) {

    if (t.includes("teradata")) {
      return `⚠️ Alta Usuario Teradata

En Teradata ya no hay altas nuevas por adelgazamiento de la plataforma.

Para obtener licencia se debe realizar una reasignación con:
✅ Vo.Bo. del usuario que cede
✅ Vo.Bo. del N4 del usuario receptor

📘 Paso a paso:
1. Validar licencia disponible.
2. Solicitar Vo.Bo.
3. Crear role en Jira.
4. Levantar alta en Helix.
5. Agregar comentario del jefe.
6. Validar acceso por Citrix.

Datos estándar:
-IP: 150.100.43.100
-Instancia: KLARMXPU/KLARMXPV
-Profile: PLAOMXP_LUSER
-Role: RLARMXP_ENDUSR_MI05779`;
    }

    if (t.includes("vpn")) {
      return `🔐 Soporte VPN

Si ya tenías permiso VPN y aparece error:

1. Cierra VPN.
2. Reinicia el equipo.
3. Abre Cisco nuevamente.
4. Intenta conectarte.

Si persiste:
📧 vpn.soporte.mx@bbva.com
☎️ 55 5226 1190
☎️ 55 5621 3434 ext. 61190 opción 1

Si no se soluciona:
🏢 Parque BBVA piso 8
🏢 Torre BBVA piso 14`;
    }

    if (t.includes("citrix") || t.includes("bloqueo")) {
      return `🖥️ Citrix / Bloqueo de usuario

Reporta al número:

📞 55 5522 61190

Importante:
Este número solo aplica para Citrix o bloqueo de usuario.
No aplica para VPN.`;
    }

    if (t.includes("dml") || t.includes("formato") || t.includes("privilegios")) {
      return `📄 Formato DML / Privilegios

BASE DE DATOS / MANEJADOR:
TERADATA

SOLICITANTE:
Usuario: M123456
Rol: RLARMXP_ENDUSR_M123456

DATOS SOLO PARA USUARIO M O XM:
Nombre del equipo: Data Engineering
Usuario de red: M123456
Mail: usuario@bbva.com

Validaciones:
✅ Usuario con formato M o XM
✅ Role con M del usuario
✅ Correo corporativo
✅ No dejar campos obligatorios vacíos`;
    }

    if (t.includes("iam") || t.includes("plantilla")) {
      return `📚 IAM Plataformas

1. Ubica la plantilla correcta.
2. NO edites la plantilla original.
3. Clona la plantilla.
4. Borra texto hasta “Plantilla”.
5. Edita la descripción.
6. Adjunta Vo.Bo. o evidencia si aplica.
7. Da seguimiento en comentarios.`;
    }

    if (t.includes("hola")) {
      return "¡Hola! 👋 Soy Diana. ¿En qué proceso te puedo ayudar hoy?";
    }

    return "Puedo ayudarte con Teradata, VPN, Citrix, IAM, Jira, Helix, formatos DML e impedimentos. Escríbeme qué necesitas y te guío paso a paso.";
  }

  function send(text = message) {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "diana", text: responder(text) }
    ]);

    setMessage("");
  }

  function getGuideSteps() {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const context = lastUserMessage ? lastUserMessage.text.toLowerCase() : "";

  if (context.includes("teradata")) {
    return [
      "📘 Guía Teradata - Paso 1\n\nPrimero confirma si el usuario ya cuenta con licencia o si será reasignación.\n\nRecuerda: en Teradata ya no hay altas nuevas; solo reasignación.",
      "📘 Guía Teradata - Paso 2\n\nSolicita el Vo.Bo. del usuario que cede la licencia y del N4 del usuario que recibirá la licencia.",
      "📘 Guía Teradata - Paso 3\n\nCon los Vo.Bo. listos, genera el correo y comentario Helix.\n\nDatos estándar:\nIP: 150.100.43.100\nInstancia: KLARMXPU/KLARMXPV\nProfile: PLAOMXP_LUSER\nRole: RLARMXP_ENDUSR_MI05779",
      "📘 Guía Teradata - Paso 4\n\nLevanta el Jira o solicitud correspondiente y después valida el acceso por Citrix.",
      "✅ Guía Teradata finalizada.\n\nYa tienes los pasos principales para continuar."
    ];
  }

  if (context.includes("vpn")) {
    return [
      "🔐 Guía VPN - Paso 1\n\nPrimero cierra la VPN completamente.",
      "🔐 Guía VPN - Paso 2\n\nReinicia el equipo y vuelve a abrir Cisco.",
      "🔐 Guía VPN - Paso 3\n\nIntenta conectarte nuevamente.",
      "🔐 Guía VPN - Paso 4\n\nSi continúa el error, contacta soporte:\nvpn.soporte.mx@bbva.com\n55 5226 1190\n55 5621 3434 ext. 61190 opción 1",
      "🏢 Si no se soluciona:\nParque BBVA piso 8\nTorre BBVA piso 14"
    ];
  }

  if (context.includes("citrix") || context.includes("bloqueo")) {
    return [
      "🖥️ Guía Citrix - Paso 1\n\nConfirma si el problema es bloqueo de usuario o acceso Citrix.",
      "🖥️ Guía Citrix - Paso 2\n\nReporta el bloqueo al número:\n55 5522 61190",
      "🖥️ Guía Citrix - Paso 3\n\nSigue las instrucciones de soporte y valida nuevamente tu acceso.",
      "✅ Guía Citrix finalizada."
    ];
  }

  if (context.includes("dml") || context.includes("formato")) {
    return [
      "📄 Guía Formato DML - Paso 1\n\nSelecciona el manejador: DB2, Oracle, Teradata, Sybase, Informix o SQL.",
      "📄 Guía Formato DML - Paso 2\n\nEn SOLICITANTE coloca la M del usuario.",
      "📄 Guía Formato DML - Paso 3\n\nEn ROL coloca el rol y la M del usuario.",
      "📄 Guía Formato DML - Paso 4\n\nEn DATOS SOLO PARA USUARIO M o XM coloca:\nNombre del equipo\nUsuario de red\nCorreo del usuario.",
      "✅ Guía Formato DML finalizada."
    ];
  }

  return [
    "📘 Modo guía activado.\n\nDime primero qué proceso necesitas:\nTeradata, VPN, Citrix, IAM o Formato DML."
  ];
}

function startGuide() {
  const steps = getGuideSteps();

  setGuideActive(true);
  setGuideStep(0);

  setMessages((prev) => [
    ...prev,
    {
      role: "diana",
      text: steps[0],
      guide: true,
      options: ["Teradata", "VPN", "Citrix", "IAM", "Formato DML"]
    }
  ]);
}

function nextGuideStep() {
  const steps = getGuideSteps();
  const nextStep = guideStep + 1;

  if (nextStep >= steps.length) {
    setGuideActive(false);
    setGuideStep(0);

    setMessages((prev) => [
      ...prev,
      {
        role: "diana",
        text: "✅ Guía terminada. Si necesitas otro proceso, escríbelo y te acompaño paso a paso."
      }
    ]);

    return;
  }

  setGuideStep(nextStep);

  setMessages((prev) => [
    ...prev,
    {
      role: "diana",
      text: steps[nextStep],
      guide: true
    }
  ]);
}

  function openLink(type) {
    const links = {
      vpn:
        "https://docs.google.com/presentation/d/1gOInm65Oesu6MtUaAefto_uc2FJsB4H8GF6vZxt_xi4/edit?slide=id.g3356b0b5634_127_70#slide=id.g3356b0b5634_127_70",
      teradata: "https://docs.google.com",
      iam: "https://docs.google.com",
      dml: "https://docs.google.com"
    };

    window.open(links[type], "_blank", "noopener,noreferrer");
  }

  const quickActions = [
    "Necesito dar de alta un usuario en Teradata",
    "Hazme el correo VoBo",
    "Tengo error VPN",
    "Tengo bloqueo en Citrix",
    "Necesito formato DML",
    "Necesito clonar plantilla IAM"
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      background: currentTheme.bg,
      color: "white",
      fontFamily: "Inter, Arial, sans-serif",
      display: "flex"
    },
    sidebar: {
      width: "290px",
      background: "#020b16",
      borderRight: `1px solid ${currentTheme.accent}`,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    main: {
      flex: 1,
      padding: "28px",
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: "24px"
    },
    card: {
      background: "rgba(8,26,47,.9)",
      border: `1px solid ${currentTheme.accent}`,
      borderRadius: "24px",
      padding: "22px",
      boxShadow: `0 0 30px ${currentTheme.accent}33`
    },
    cyan: {
      color: currentTheme.accent
    },
    button: {
      background: currentTheme.accent,
      color: "black",
      border: "none",
      borderRadius: "16px",
      padding: "14px 22px",
      fontWeight: "800",
      cursor: "pointer"
    },
    ghostButton: {
      background: "#0b2747",
      color: "white",
      border: `1px solid ${currentTheme.accent}`,
      borderRadius: "16px",
      padding: "12px 16px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <img
              src={avatar}
              alt="Diana"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop";
              }}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                objectFit: "cover",
                border: `2px solid ${currentTheme.accent}`
              }}
            />
            <div>
              <h2 style={{ margin: 0, color: currentTheme.accent }}>
                Asistente Diana
              </h2>
              <p style={{ margin: "4px 0", color: "#94a3b8" }}>
                Copiloto BBVA
              </p>
            </div>
          </div>

          <div style={{ marginTop: "28px", display: "grid", gap: "12px" }}>
            {[
              "💬 Chat",
              "🏠 Inicio",
              "📚 Conocimiento",
              "📘 Guías paso a paso",
              "⚡ Generadores",
              "🔐 IAM / Accesos",
              "🧾 Jira / Helix",
              "🖥️ VPN / Citrix",
              "🚨 Impedimentos",
              "📊 Analysis 2.0"
            ].map((item) => (
              <div key={item} style={styles.ghostButton}>
                {item}
              </div>
            ))}
          </div>
        </div>
        
        const avatars = {
          "Original": "/diana-avatar.png",
        "Moreno claro": "/diana-avatar-morena.png",
        "Claro": "/diana-avatar-clara.png"
        };
        
        const avatar = avatars[skinTone];
        
        <div style={{
      ...styles.card,
      background: "rgba(2,11,22,.96)",
      borderRadius: "26px",
      padding: "18px"
    }}>
          <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px"
    }}>
            <h3 style={{ color: "white", margin: 0 }}>
              Configuración de Diana
            </h3>
            <span style={{ color: "#94a3b8", fontSize: "22px" }}>×</span>
          </div>
          
          <div style={{
      border: `1px solid ${currentTheme.accent}44`,
      borderRadius: "18px",
      padding: "16px",
      background: "rgba(8,26,47,.65)"
    }}>
            <h4 style={{ color: currentTheme.accent, marginBottom: "4px" }}>
              Apariencia
            </h4>
            
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: 0 }}>
              Personaliza la apariencia de Diana.
            </p>
            
            <label>Color de piel</label>
            
            <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "10px",
      marginTop: "10px",
      marginBottom: "20px"
    }}>
              {[
      ["Original", "/diana-avatar.png"],
      ["Moreno claro", "/diana-avatar-morena.png"],
      ["Claro", "/diana-avatar-clara.png"]
    ].map(([tone, img]) => (
      <button
        key={tone}
        onClick={() => setSkinTone(tone)}
        style={{
          background: "#061428",
          border:
            
            skinTone === tone
            ? `2px solid ${currentTheme.accent}`
            : "1px solid #1e3a5f",
          borderRadius: "14px",
          padding: "6px",
          color: "white",
          cursor: "pointer"
        }}
        
      >
        
        <img
          src={img}
          onError={(e) => {
            e.currentTarget.src = "/diana-avatar.png";
          }}
          
          style={{
            width: "100%",
            height: "82px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "6px"
          }}
          
          />
        <div style={{ fontSize: "11px" }}>{tone}</div>
      </button>
    ))}
            </div>
            <hr style={{ borderColor: "#1e3a5f", opacity: .5 }} />
            <label>Color principal</label>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
              Color con el que Diana te responde y te guía.
            </p>
            
            <div style={{
      display: "flex",
      gap: "12px",
      margin: "12px 0 20px"
    }}>
              {[
      ["BBVA Premium", "#38bdf8"],
      ["Turquesa Tecnológico", "#2dd4bf"],
      ["Oscuro Profesional", "#60a5fa"],
      ["Púrpura Creativo", "#c084fc"]
    ].map(([name, color]) => (
      
      <button
        key={name}
        onClick={() => setTheme(name)}
        title={name}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: color,
          border:
            theme === name
            ? "3px solid white"
            : "1px solid transparent",
          cursor: "pointer"
        }}
        />
    ))}
            </div>
            <hr style={{ borderColor: "#1e3a5f", opacity: .5 }} />
            <label>Tema</label>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
              Selecciona el tema visual.
            </p>
            
            <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      marginBottom: "20px"
    }}>
              <button
                onClick={() => setTheme("Oscuro Profesional")}
                style={{
                  ...styles.ghostButton,
                  border:
                    theme === "Oscuro Profesional"
                    ? `2px solid ${currentTheme.accent}`
                    : `1px solid ${currentTheme.accent}`
                }}
                >
                
                🌙 Oscuro
              </button>
              <button
                onClick={() => setTheme("BBVA Premium")}
                style={styles.ghostButton}
                >
                
                ☀️ Claro
              </button>
            </div>
            
            <hr style={{ borderColor: "#1e3a5f", opacity: .5 }} />
            <h4 style={{ color: currentTheme.accent, marginBottom: "8px" }}>
              Tipografía
            </h4>

    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      marginBottom: "20px"
    }}>
      <select style={{
        background: "#061428",
        color: "white",
        border: "1px solid #1e3a5f",
        borderRadius: "12px",
        padding: "10px"
      }}>
        <option>Inter</option>
        <option>Arial</option>
        <option>Roboto</option>
      </select>

      <select style={{
        background: "#061428",
        color: "white",
        border: "1px solid #1e3a5f",
        borderRadius: "12px",
        padding: "10px"
      }}>
        <option>Mediano</option>
        <option>Grande</option>
        <option>Pequeño</option>
      </select>
    </div>

    <hr style={{ borderColor: "#1e3a5f", opacity: .5 }} />

    <h4 style={{ color: currentTheme.accent, marginBottom: "8px" }}>
      Avatar
    </h4>

    <button style={{
      ...styles.ghostButton,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px"
    }}>
      🤖 Editar avatar
    </button>

    <hr style={{ borderColor: "#1e3a5f", opacity: .5 }} />

    <h4 style={{ color: currentTheme.accent, marginBottom: "8px" }}>
      Comportamiento
    </h4>

    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px"
    }}>
      <select style={{
        background: "#061428",
        color: "white",
        border: "1px solid #1e3a5f",
        borderRadius: "12px",
        padding: "10px"
      }}>
        <option>Detalladas</option>
        <option>Directas</option>
      </select>

      <select style={{
        background: "#061428",
        color: "white",
        border: "1px solid #1e3a5f",
        borderRadius: "12px",
        padding: "10px"
      }}>
        <option>Activado</option>
        <option>Desactivado</option>
      </select>
    </div>
  </div>
</div>
        <label>Tema</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              width: "100%",
              marginTop: "8px",
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "12px",
              background: "#0b2747",
              color: "white",
              border: `1px solid ${currentTheme.accent}`
            }}
          >
            <option>BBVA Premium</option>
            <option>Oscuro Profesional</option>
            <option>Turquesa Tecnológico</option>
            <option>Púrpura Creativo</option>
          </select>

          <label>Color de piel</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "8px",
              marginTop: "8px"
            }}
          >
            {["Original", "Moreno claro", "Claro"].map((tone) => (
              <button
                key={tone}
                onClick={() => setSkinTone(tone)}
                style={{
                  ...styles.ghostButton,
                  border:
                    skinTone === tone
                      ? `2px solid ${currentTheme.accent}`
                      : `1px solid ${currentTheme.accent}`
                }}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <section>
          <div style={{ ...styles.card, marginBottom: "22px" }}>
            <div style={{ display: "flex", gap: "22px", alignItems: "center" }}>
              <img
                src={avatar}
                alt="Diana avatar"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop";
                }}
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${currentTheme.glow}`,
                  boxShadow: `0 0 45px ${currentTheme.glow}`
                }}
              />
              <div>
                <h1 style={{ fontSize: "44px", margin: 0 }}>
                  👋 Hola, soy <span style={styles.cyan}>Diana</span>
                </h1>
                <p style={{ fontSize: "18px", color: "#cbd5e1" }}>
                  Tu asistente inteligente BBVA para procesos, accesos, soporte
                  y generación automática.
                </p>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    padding: "10px 18px",
                    borderRadius: "999px",
                    background: "rgba(34,197,94,.12)",
                    border: "1px solid #22c55e",
                    color: "#86efac"
                  }}
                >
                  ● Diana Online
                </div>
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, height: "520px", overflowY: "auto" }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "18px"
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "18px",
                    borderRadius: "22px",
                    background: m.role === "user" ? "#123d6b" : "#031525",
                    border: `1px solid ${currentTheme.accent}`
                  }}
                >
                  <strong style={styles.cyan}>
                    {m.role === "user" ? "Usuario" : "🤖 Diana"}
                  </strong>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                      lineHeight: "1.6"
                    }}
                  >
                    {m.text}
                  </pre>

                  {m.role === "diana" && !guideActive && !m.guide && (
                  <button onClick={startGuide} style={styles.button}>
                    Da click si deseas que te guíe →
                  </button>
                )}
                  
                  {m.role === "diana" && guideActive && m.guide && (
                  <button onClick={nextGuideStep} style={styles.button}>
                    Siguiente paso →
                  </button>
                )}
                  
                  {m.role === "diana" && m.options && (
                  <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
                    {m.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => send(option)}
                      style={styles.ghostButton}
                      >
                      {option}
                    </button>
                  ))}
                  </div>
                )}
                  
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Escribe tu mensaje..."
              style={{
                flex: 1,
                padding: "18px",
                borderRadius: "18px",
                background: "#0b2747",
                color: "white",
                border: `1px solid ${currentTheme.accent}`,
                outline: "none"
              }}
            />
            <button onClick={() => send()} style={styles.button}>
              Enviar
            </button>
          </div>
        </section>

        <aside>
          <div style={{ ...styles.card, marginBottom: "18px" }}>
            <h3 style={styles.cyan}>⚡ Acciones rápidas</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => send(action)}
                  style={styles.ghostButton}
                >
                  {action}
                </button>
              ))}

              <button onClick={() => openLink("vpn")} style={styles.ghostButton}>
                📘 Abrir guía VPN
              </button>

              <button
                onClick={() => openLink("teradata")}
                style={styles.ghostButton}
              >
                📘 Abrir manual Teradata
              </button>

              <button onClick={() => openLink("dml")} style={styles.ghostButton}>
                📄 Abrir formato DML
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: "18px" }}>
            <h3 style={styles.cyan}>📌 Generadores</h3>
            {[
              "Correo VoBo",
              "Comentario Helix",
              "Historia Jira",
              "Formato DML",
              "Plantilla IAM"
            ].map((g) => (
              <button
                key={g}
                onClick={() => send(g)}
                style={{ ...styles.ghostButton, marginBottom: "8px", width: "100%" }}
              >
                {g}
              </button>
            ))}
          </div>
          <div style={styles.card}>
            <h3 style={styles.cyan}>🟢 Estado de servicios</h3>
            <p>Teradata: Operativo</p>
            <p>VPN: Operativo</p>
            <p>IAM: Operativo</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

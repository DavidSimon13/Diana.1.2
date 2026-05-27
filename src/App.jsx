import React, { useState } from "react";

export default function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [visualGuide, setVisualGuide] = useState(null);
  const [visualStep, setVisualStep] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [serviceStatus] = useState({
    vpn: "operativo",
    iam: "operativo",
    citrix: "degradado",
    teradata: "operativo"
  });
  const [lastAction, setLastAction] = useState(null);
  const [manualSearch, setManualSearch] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfText, setPdfText] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [skinTone, setSkinTone] = useState("Original");
  const [theme, setTheme] = useState("BBVA Premium");
  const [guideActive, setGuideActive] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [contexto, setContexto] = useState({
    procesoActual: null,
    ultimoPaso: null,
    usuario: null,
    area: null,
    ultimoGenerador: null
  });
  const [messages, setMessages] = useState([
    {
      role: "diana",
      text: "Hola 👋 Soy Diana, tu copiloto inteligente BBVA. Estoy aquí para ayudarte con procesos, soporte, accesos, formatos, Jira, Helix, VPN, Citrix, IAM y Teradata."
    }
  ]);

  const avatars = {
    Original: "/diana-avatar.png",
    "Moreno claro": "/diana-avatar-morena.png",
    Claro: "/diana-avatar-clara.png"
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

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function copiarTexto(texto) {
    navigator.clipboard.writeText(texto);
    alert("Texto copiado ✅");
  }

  function actualizarContexto(intent, texto) {
    setContexto((prev) => ({
      ...prev,
      procesoActual: intent !== "general" ? intent : prev.procesoActual,
      ultimoPaso: texto,
      ultimoGenerador:
        intent === "vobo" ||
        intent === "dml" ||
        intent === "jira" ||
        intent === "helix"
          ? intent
          : prev.ultimoGenerador
    }));
  }

  function detectarIntencion(texto) {
    const t = normalizar(texto);

    if (t.includes("teradata") || t.includes("reasignacion")) return "teradata";
    if (t.includes("vpn") || t.includes("cisco") || t.includes("certificate")) return "vpn";
    if (t.includes("citrix") || t.includes("bloqueo")) return "citrix";
    if (t.includes("iam") || t.includes("plantilla")) return "iam";
    if (t.includes("dml") || t.includes("formato") || t.includes("privilegios") || t.includes("role")) return "dml";
    if (t.includes("jira") || t.includes("ticket")) return "jira";
    if (t.includes("comentario") && t.includes("helix")) return "helix";
    if (t.includes("escalamiento") || t.includes("escalar")) return "escalamiento";
    if (t.includes("cierre") || t.includes("cerrar caso")) return "cierre";

    if (
      t.includes("vobo") ||
      t.includes("vo.bo") ||
      t.includes("vo bo") ||
      t.includes("aprobacion") ||
      t.includes("correo")
    ) {
      return "vobo";
    }

    if (t.includes("hola") || t.includes("buen dia") || t.includes("buenas")) return "saludo";

    return "general";
  }

  function generarTicketJira() {
    return `🎫 Ticket Jira generado

Resumen:
Alta / modificación de acceso

Descripción:
Se solicita apoyo para gestionar el acceso correspondiente.

Usuario:
[M / XM]

Área:
[Área del usuario]

Justificación:
[Motivo de la solicitud]

Acceptance Criteria:
- Solicitud registrada correctamente.
- Evidencia adjunta.
- Acceso validado por el usuario.`;
  }

  function generarComentarioHelix() {
    return `💬 Comentario Helix generado

Se cuenta con Vo.Bo. correspondiente para continuar con la solicitud.

Datos:
-ID:
-Nombre:
-Puesto:
-Área:
-IP: 150.100.43.100
-Instancia: KLARMXPU/KLARMXPV
-Profile a asignar: PLAOMXP_LUSER
-Role: RLARMXP_ENDUSR_MI05779`;
  }

  function generarEscalamiento() {
    return `📧 Correo de escalamiento

Hola equipo, buen día.

Solicito su apoyo para revisar el siguiente caso, ya que se encuentra detenido y requiere seguimiento.

Proceso:
[Proceso afectado]

Usuario:
[M / XM]

Impacto:
[Describir impacto]

Evidencia:
[Adjuntar evidencia]

Quedo atento(a) a sus comentarios.

Saludos.`;
  }

  function generarCierre() {
    return `✅ Comentario de cierre

Se valida que la solicitud fue atendida correctamente.

Resultado:
[Describir resultado]

Validación:
[Usuario confirma acceso / proceso completado]

Se procede con el cierre del caso.

Saludos.`;
  }

  function responder(txt) {
    const t = normalizar(txt);
    const intent = detectarIntencion(txt);

    if (t.includes("ya tengo el vobo") || t.includes("ya tengo el vo.bo")) {
      return `Perfecto 👌

Como ya tienes el Vo.Bo., el siguiente paso es:

1. Adjuntar la evidencia.
2. Crear o actualizar la solicitud en Jira / Helix.
3. Agregar comentario con datos del usuario.
4. Validar que el role y profile sean correctos.
5. Dar seguimiento hasta confirmación.

¿Quieres que te genere el comentario Helix o el ticket Jira?`;
    }

    if (intent === "jira") {
      actualizarContexto("jira", txt);
      return generarTicketJira();
    }

    if (intent === "helix") {
      actualizarContexto("helix", txt);
      return generarComentarioHelix();
    }

    if (intent === "escalamiento") {
      actualizarContexto("escalamiento", txt);
      return generarEscalamiento();
    }

    if (intent === "cierre") {
      actualizarContexto("cierre", txt);
      return generarCierre();
    }

    if (intent === "vobo") {
      return `📧 Mensaje para solicitar Vo.Bo.

Hola [NOMBRE DEL JEFE] buen día, espero que se encuentren muy bien.

El motivo de este correo es solicitar tu amable Vo.Bo. para levantar las solicitudes de creación de rol en JIRA y posteriormente el alta de usuario en Helix.

Estos movimientos son por reasignación:
[Usuario a quien se hará la reasignación]

Saludos.

━━━━━━━━━━━━━━━━━━━━━━

📌 Mensaje para el usuario

Ando tramitando tu alta de Teradata pero necesito el Vo.Bo. de tu jefe directo con la siguiente estructura:

“Yo como jefe del usuario XXXXX otorgo el Vo.Bo. para alta del usuario MX indicando los siguientes datos:
-ID
-Nombre
-Puesto
-Área
-IP
-Instancia
-Profile a asignar
-Role”

Yo te proporciono los siguientes datos:
-IP: 150.100.43.100
-Instancia: KLARMXPU/KLARMXPV
-Profile a asignar: PLAOMXP_LUSER
-Role: RLARMXP_ENDUSR_MI05779`;
    }

    if (intent === "teradata") {
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
6. Validar acceso por Citrix.`;
    }

    if (intent === "vpn") {
      return `🔐 Soporte VPN

1. Cierra VPN.
2. Reinicia el equipo.
3. Abre Cisco nuevamente.
4. Intenta conectarte.

Si persiste:
📧 vpn.soporte.mx@bbva.com
☎️ 55 5226 1190
☎️ 55 5621 3434 ext. 61190 opción 1`;
    }

    if (intent === "citrix") {
      return `🖥️ Citrix / Bloqueo de usuario

Reporta al número:

📞 55 5522 61190

Este número solo aplica para Citrix o bloqueo de usuario.`;
    }

    if (intent === "dml") {
      return `📄 Formato DML / Privilegios

BASE DE DATOS / MANEJADOR:
TERADATA

SOLICITANTE:
Usuario: M123456
Rol: RLARMXP_ENDUSR_M123456

DATOS SOLO PARA USUARIO M O XM:
Nombre del equipo: Data Engineering
Usuario de red: M123456
Mail: usuario@bbva.com`;
    }

    if (intent === "iam") {
      return `📚 IAM Plataformas

1. Ubica la plantilla correcta.
2. NO edites la plantilla original.
3. Clona la plantilla.
4. Borra texto hasta “Plantilla”.
5. Edita la descripción.
6. Adjunta Vo.Bo. o evidencia si aplica.
7. Da seguimiento en comentarios.`;
    }

    if (intent === "saludo") {
      return "¡Hola! 👋 Soy Diana. ¿En qué proceso te puedo ayudar hoy?";
    }

    return `🤖 Puedo ayudarte con:

✅ Teradata
✅ VPN
✅ Citrix
✅ IAM
✅ Jira / Helix
✅ Formatos DML
✅ Impedimentos
✅ Analysis 2.0

Escríbeme qué necesitas y te guío paso a paso.`;
  }

  function send(text = message) {
    if (!text.trim()) return;

    const respuestaDiana = responder(text);
    const intent = detectarIntencion(text);

    setGuideActive(false);
    setGuideStep(0);
    setLastAction(intent);
    setIsTyping(true);

    setChatHistory((prev) => [
      {
        titulo: text.length > 28 ? text.slice(0, 28) + "..." : text,
        proceso: intent,
        fecha: new Date().toLocaleTimeString()
      },
      ...prev
    ]);

    setMessages((prev) => [...prev, { role: "user", text }]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "diana", text: respuestaDiana }]);
      setIsTyping(false);
    }, 700);
  }

  function getGuideSteps() {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const context = lastUserMessage ? normalizar(lastUserMessage.text) : "";

    if (context.includes("teradata")) {
      return [
        "📘 Guía Teradata - Paso 1\n\nConfirma si el usuario ya cuenta con licencia o si será reasignación.",
        "📘 Guía Teradata - Paso 2\n\nSolicita el Vo.Bo. del usuario que cede la licencia y del N4 del usuario receptor.",
        "📘 Guía Teradata - Paso 3\n\nCon los Vo.Bo. listos, genera el correo y comentario Helix.",
        "📘 Guía Teradata - Paso 4\n\nLevanta Jira / Helix y valida acceso por Citrix.",
        "✅ Guía Teradata finalizada."
      ];
    }

    return ["📘 Modo guía activado.\n\nSelecciona una opción para comenzar."];
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
        { role: "diana", text: "✅ Guía terminada. Si necesitas otro proceso, escríbelo y te acompaño paso a paso." }
      ]);
      return;
    }

    setGuideStep(nextStep);
    setMessages((prev) => [...prev, { role: "diana", text: steps[nextStep], guide: true }]);
  }

  function openLink(type) {
    const links = {
      vpn: "https://docs.google.com/presentation/d/1gOInm65Oesu6MtUaAefto_uc2FJsB4H8GF6vZxt_xi4/edit?slide=id.g3356b0b5634_127_70#slide=id.g3356b0b5634_127_70",
      teradata: "https://docs.google.com",
      iam: "https://docs.google.com",
      dml: "https://docs.google.com"
    };

    window.open(links[type], "_blank", "noopener,noreferrer");
  }

  function handleFileUpload(event) {
    const files = Array.from(event.target.files);

    const nuevosArchivos = files.map((file) => ({
      nombre: file.name,
      tipo: file.type,
      tamaño: `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file)
    }));

    setUploadedFiles((prev) => [...nuevosArchivos, ...prev]);

    const pdf = files.find((f) => f.type.includes("pdf"));

    if (pdf) {
      setPdfText(`📄 Documento detectado:
${pdf.name}

Diana ya puede:
✅ Mostrar el documento
✅ Abrir el PDF
✅ Usarlo como evidencia
✅ Buscar información
✅ Resumir contenido manualmente`);
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "diana",
        text: `📎 Detecté ${files.length} archivo(s).

Puedo ayudarte a:
✅ Revisar documentos
✅ Validar formatos
✅ Analizar imágenes
✅ Confirmar evidencia
✅ Guiarte con archivos`
      }
    ]);
  }

  function abrirGuiaVisual(tipo) {
    const guias = {
      teradata: {
        titulo: "Alta Usuario Teradata",
        descripcion: "Diana te guía visualmente para solicitar alta o reasignación Teradata.",
        pasos: [
          { texto: "Busca el servicio relacionado con Teradata.", imagen: "/guia-visual-completa.png" },
          { texto: "Selecciona Alta Usuario Teradata.", imagen: "/guia-visual-completa.png" },
          { texto: "Llena los datos del usuario y adjunta Vo.Bo.", imagen: "/guia-visual-completa.png" },
          { texto: "Envía la solicitud y da seguimiento.", imagen: "/guia-visual-completa.png" }
        ]
      },
      vpn: {
        titulo: "Guía visual VPN",
        descripcion: "Diana te muestra qué hacer cuando aparece error VPN.",
        pasos: [
          { texto: "Cierra y desconecta la VPN.", imagen: "/guia-visual-completa.png" },
          { texto: "Reinicia el equipo.", imagen: "/guia-visual-completa.png" },
          { texto: "Abre Cisco y vuelve a conectar.", imagen: "/guia-visual-completa.png" },
          { texto: "Si persiste, contacta soporte VPN.", imagen: "/guia-visual-completa.png" }
        ]
      },
      iam: {
        titulo: "Guía visual IAM",
        descripcion: "Diana te guía para clonar plantillas y llenar solicitudes IAM.",
        pasos: [
          { texto: "Ubica la plantilla correcta.", imagen: "/guia-visual-completa.png" },
          { texto: "No edites la plantilla original.", imagen: "/guia-visual-completa.png" },
          { texto: "Clona la plantilla.", imagen: "/guia-visual-completa.png" },
          { texto: "Edita descripción, adjunta evidencia y envía.", imagen: "/guia-visual-completa.png" }
        ]
      }
    };

    setVisualGuide(guias[tipo]);
    setVisualStep(0);
  }

  const quickActions = [
    "Necesito dar de alta un usuario en Teradata",
    "Hazme el correo VoBo",
    "Tengo error VPN",
    "Tengo bloqueo en Citrix",
    "Necesito formato DML",
    "Necesito clonar plantilla IAM"
  ];

  const manuales = [
    {
      nombre: "Manual VPN",
      tipo: "vpn",
      descripcion: "Guía para alta VPN, errores Cisco y soporte.",
      link: "https://docs.google.com/presentation/d/1gOInm65Oesu6MtUaAefto_uc2FJsB4H8GF6vZxt_xi4/edit?slide=id.g3356b0b5634_127_70#slide=id.g3356b0b5634_127_70"
    },
    {
      nombre: "Manual Teradata",
      tipo: "teradata",
      descripcion: "Proceso de reasignación, VoBo, Jira y Helix.",
      link: "https://docs.google.com"
    },
    {
      nombre: "Manual IAM",
      tipo: "iam",
      descripcion: "Plantillas, clonado, accesos y evidencias.",
      link: "https://docs.google.com"
    },
    {
      nombre: "Formato DML",
      tipo: "dml",
      descripcion: "Formato para privilegios y roles.",
      link: "https://docs.google.com"
    }
  ];

  const manualesFiltrados = manuales.filter((m) =>
    `${m.nombre} ${m.tipo} ${m.descripcion}`
      .toLowerCase()
      .includes(manualSearch.toLowerCase())
  );

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
      padding: "24px"
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
    cyan: { color: currentTheme.accent },
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
    <>
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 999,
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          border: `1px solid ${currentTheme.accent}`,
          background: "#061428",
          color: currentTheme.accent,
          fontSize: "22px",
          cursor: "pointer"
        }}
      >
        ⚙️
      </button>

      {showSettings && (
        <div style={{ position: "fixed", top: "84px", right: "20px", width: "380px", zIndex: 998, ...styles.card }}>
          <h3 style={styles.cyan}>Configuración de Diana</h3>

          <label>Color de piel</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "10px" }}>
            {Object.entries(avatars).map(([tone, img]) => (
              <button key={tone} onClick={() => setSkinTone(tone)} style={styles.ghostButton}>
                <img src={img} alt={tone} style={{ width: "100%", height: "85px", objectFit: "cover", borderRadius: "10px" }} />
                {tone}
              </button>
            ))}
          </div>

          <h4 style={styles.cyan}>Tema</h4>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#061428", color: "white" }}
          >
            <option>BBVA Premium</option>
            <option>Oscuro Profesional</option>
            <option>Turquesa Tecnológico</option>
            <option>Púrpura Creativo</option>
          </select>
        </div>
      )}

      <div style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <img src={avatar} alt="Diana" style={{ width: "64px", height: "64px", borderRadius: "20px", objectFit: "cover" }} />
            <div>
              <h2 style={{ margin: 0, color: currentTheme.accent }}>Asistente Diana</h2>
              <p style={{ margin: "4px 0", color: "#94a3b8" }}>Copiloto BBVA</p>
            </div>
          </div>

          <div style={{ marginTop: "28px", display: "grid", gap: "12px" }}>
            {["💬 Chat", "🏠 Inicio", "📚 Conocimiento", "📘 Guías paso a paso", "⚡ Generadores", "🔐 IAM / Accesos", "🧾 Jira / Helix", "🖥️ VPN / Citrix", "🚨 Impedimentos", "📊 Analysis 2.0"].map((item) => (
              <div key={item} style={styles.ghostButton}>{item}</div>
            ))}

            <h3 style={styles.cyan}>🕘 Historial</h3>
            {chatHistory.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Aún no hay conversaciones.</p>
            ) : (
              chatHistory.slice(0, 5).map((item, index) => (
                <div key={index} style={{ ...styles.ghostButton, fontSize: "12px" }}>
                  <strong>{item.titulo}</strong><br />
                  <span style={{ color: "#94a3b8" }}>{item.proceso} · {item.fecha}</span>
                </div>
              ))
            )}
          </div>
        </aside>

        <main style={styles.main}>
          {visualGuide && (
            <div style={{ position: "fixed", top: "90px", right: "430px", width: "560px", maxHeight: "82vh", overflowY: "auto", zIndex: 997, ...styles.card }}>
              <button onClick={() => setVisualGuide(null)} style={{ float: "right", background: "transparent", color: "white", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
              <h2 style={styles.cyan}>📘 {visualGuide.titulo}</h2>
              <p>{visualGuide.descripcion}</p>
              <div style={{ padding: "12px", borderRadius: "16px", background: "#0b2747", border: `1px solid ${currentTheme.accent}` }}>
                <strong style={styles.cyan}>Paso {visualStep + 1} de {visualGuide.pasos.length}</strong>
                <p>{visualGuide.pasos[visualStep].texto}</p>
                <img src={visualGuide.pasos[visualStep].imagen} alt="Paso visual" style={{ width: "100%", borderRadius: "16px" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button onClick={() => setVisualStep(Math.max(visualStep - 1, 0))} style={styles.ghostButton}>← Anterior</button>
                <button onClick={() => setVisualStep(Math.min(visualStep + 1, visualGuide.pasos.length - 1))} style={styles.button}>Siguiente →</button>
              </div>
            </div>
          )}

          <section>
            <div style={{ ...styles.card, marginBottom: "22px" }}>
              <div style={{ display: "flex", gap: "22px", alignItems: "center" }}>
                <img src={avatar} alt="Diana avatar" style={{ width: "180px", height: "180px", borderRadius: "50%", objectFit: "cover", boxShadow: `0 0 45px ${currentTheme.glow}` }} />
                <div>
                  <h1 style={{ fontSize: "44px", margin: 0 }}>👋 Hola, soy <span style={styles.cyan}>Diana</span></h1>
                  <p style={{ fontSize: "18px", color: "#cbd5e1" }}>Tu asistente inteligente BBVA para procesos, accesos, soporte y generación automática.</p>
                  <div style={{ color: "#86efac" }}>● Diana Online</div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.card, height: "520px", overflowY: "auto" }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "18px" }}>
                  <div style={{ maxWidth: "78%", padding: "18px", borderRadius: "22px", background: m.role === "user" ? "#123d6b" : "#031525", border: `1px solid ${currentTheme.accent}` }}>
                    <strong style={styles.cyan}>{m.role === "user" ? "Usuario" : "🤖 Diana"}</strong>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.6" }}>{m.text}</pre>

                    {m.role === "diana" && !guideActive && !m.guide && (
                      <button onClick={startGuide} style={styles.button}>Da click si deseas que te guíe →</button>
                    )}

                    {m.role === "diana" && (
                      <button onClick={() => copiarTexto(m.text)} style={{ ...styles.ghostButton, marginTop: "10px" }}>📋 Copiar respuesta</button>
                    )}

                    {m.role === "diana" && guideActive && m.guide && (
                      <button onClick={nextGuideStep} style={styles.button}>Siguiente paso →</button>
                    )}

                    {m.role === "diana" && m.options && (
                      <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
                        {m.options.map((option) => (
                          <button key={option} onClick={() => send(option)} style={styles.ghostButton}>{option}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ maxWidth: "260px", padding: "14px 18px", borderRadius: "18px", background: "#031525", border: `1px solid ${currentTheme.accent}`, color: "#cbd5e1" }}>
                  🤖 Diana está escribiendo...
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
              <label style={{ ...styles.ghostButton, display: "inline-block", cursor: "pointer" }}>
                📎 Adjuntar
                <input type="file" multiple onChange={handleFileUpload} style={{ display: "none" }} />
              </label>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Escribe tu mensaje..."
                style={{ flex: 1, padding: "18px", borderRadius: "18px", background: "#0b2747", color: "white", border: `1px solid ${currentTheme.accent}` }}
              />
              <button onClick={() => send()} style={styles.button}>Enviar</button>
            </div>
          </section>

          <aside>
            <div style={{ ...styles.card, marginBottom: "18px" }}>
              <h3 style={styles.cyan}>🔍 Buscador de manuales</h3>
              <input value={manualSearch} onChange={(e) => setManualSearch(e.target.value)} placeholder="Buscar VPN, IAM, Teradata..." style={{ width: "100%", padding: "12px", borderRadius: "14px", background: "#0b2747", color: "white", border: `1px solid ${currentTheme.accent}`, marginBottom: "12px", boxSizing: "border-box" }} />
              {manualesFiltrados.map((manual) => (
                <button key={manual.nombre} onClick={() => window.open(manual.link, "_blank", "noopener,noreferrer")} style={{ ...styles.ghostButton, marginBottom: "8px", width: "100%" }}>
                  <strong>{manual.nombre}</strong><br />
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{manual.descripcion}</span>
                </button>
              ))}
            </div>

            <div style={{ ...styles.card, marginBottom: "18px" }}>
              <h3 style={styles.cyan}>⚡ Acciones rápidas</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {quickActions.map((action) => (
                  <button key={action} onClick={() => send(action)} style={styles.ghostButton}>{action}</button>
                ))}
                <button onClick={() => abrirGuiaVisual("teradata")} style={styles.ghostButton}>🖼️ Ver guía visual Teradata</button>
                <button onClick={() => abrirGuiaVisual("vpn")} style={styles.ghostButton}>🖼️ Ver guía visual VPN</button>
                <button onClick={() => abrirGuiaVisual("iam")} style={styles.ghostButton}>🖼️ Ver guía visual IAM</button>
                <button onClick={() => openLink("vpn")} style={styles.ghostButton}>📘 Abrir guía VPN</button>
                <button onClick={() => openLink("teradata")} style={styles.ghostButton}>📘 Abrir manual Teradata</button>
                <button onClick={() => openLink("dml")} style={styles.ghostButton}>📄 Abrir formato DML</button>
              </div>
            </div>

            <div style={{ ...styles.card, marginBottom: "18px" }}>
              <h3 style={styles.cyan}>📌 Generadores</h3>
              {["Correo VoBo", "Comentario Helix", "Historia Jira", "Formato DML", "Plantilla IAM"].map((g) => (
                <button key={g} onClick={() => send(g)} style={{ ...styles.ghostButton, marginBottom: "8px", width: "100%" }}>{g}</button>
              ))}
            </div>

            <div style={{ ...styles.card, marginBottom: "18px" }}>
              <h3 style={styles.cyan}>📂 Archivos adjuntos</h3>
              {pdfText && <div style={{ marginTop: "12px", padding: "12px", borderRadius: "14px", background: "#061428", border: `1px solid ${currentTheme.accent}`, whiteSpace: "pre-wrap" }}>{pdfText}</div>}
              {uploadedFiles.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No hay archivos cargados.</p>
              ) : (
                uploadedFiles.map((file, index) => (
                  <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" style={{ ...styles.ghostButton, display: "block", marginBottom: "8px", textDecoration: "none" }}>
                    <strong>{file.nombre}</strong><br />
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{file.tamaño}</span>
                  </a>
                ))
              )}
            </div>

            <div style={styles.card}>
              <h3 style={styles.cyan}>📊 Estado de servicios</h3>
              {Object.entries(serviceStatus).map(([servicio, estado]) => {
                const color = estado === "operativo" ? "#22c55e" : estado === "degradado" ? "#facc15" : "#ef4444";
                const icono = estado === "operativo" ? "🟢" : estado === "degradado" ? "🟡" : "🔴";

                return (
                  <div key={servicio} style={{ display: "flex", justifyContent: "space-between", padding: "10px", marginBottom: "8px", borderRadius: "12px", background: "#0b2747", border: `1px solid ${color}` }}>
                    <span style={{ textTransform: "uppercase" }}>{servicio}</span>
                    <span style={{ color }}>{icono} {estado}</span>
                  </div>
                );
              })}

              {lastAction && (
                <div style={{ marginTop: "14px", padding: "12px", borderRadius: "14px", background: "rgba(56,189,248,.08)", border: `1px solid ${currentTheme.accent}` }}>
                  <strong style={styles.cyan}>Última acción:</strong><br />
                  {lastAction}
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}

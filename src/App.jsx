import React, { useState } from "react";

export default function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [visualGuide, setVisualGuide] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [serviceStatus, setServiceStatus] = useState({
  vpn: "operativo",
  iam: "operativo",
  citrix: "degradado",
  teradata: "operativo"
});
  
  const [lastAction, setLastAction] = useState(null);
  const [manualSearch, setManualSearch] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [skinTone, setSkinTone] = useState("Original");
  const [theme, setTheme] = useState("BBVA Premium");
  const [guideActive, setGuideActive] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
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

  const [contexto, setContexto] = useState({
  procesoActual: null,
  ultimoPaso: null,
  usuario: null,
  area: null,
  ultimoGenerador: null
});

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
      intent === "vobo" || intent === "dml" || intent === "jira" || intent === "helix"
        ? intent
        : prev.ultimoGenerador
  }));
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
  
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  
  function detectarIntencion(texto) {
    const t = normalizar(texto);

    if (t.includes("teradata") || t.includes("reasignacion")) return "teradata";
    if (t.includes("vpn") || t.includes("cisco") || t.includes("certificate")) return "vpn";
    if (t.includes("citrix") || t.includes("bloqueo")) return "citrix";
    if (t.includes("iam") || t.includes("plantilla")) return "iam";
    if (t.includes("dml") || t.includes("formato") || t.includes("privilegios") || t.includes("role")) return "dml";

    if (
      t.includes("vobo") ||
      t.includes("vo.bo") ||
      t.includes("vo bo") ||
      t.includes("aprobacion") ||
      t.includes("solicitar visto bueno") ||
      t.includes("correo")
    ) {
      return "vobo";
    }

    if (t.includes("hola") || t.includes("buen dia") || t.includes("buenas")) return "saludo";

    return "general";
  }

  function responder(txt) {
    const intent = detectarIntencion(txt);

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
6. Validar acceso por Citrix.

📌 Datos estándar:
-IP: 150.100.43.100
-Instancia: KLARMXPU/KLARMXPV
-Profile: PLAOMXP_LUSER
-Role: RLARMXP_ENDUSR_MI05779`;
    }

    if (intent === "vpn") {
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

    if (intent === "citrix") {
      return `🖥️ Citrix / Bloqueo de usuario

Reporta al número:

📞 55 5522 61190

Importante:
Este número solo aplica para Citrix o bloqueo de usuario.
No aplica para VPN.`;
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
Mail: usuario@bbva.com

✅ Validaciones:
- Usuario con formato M o XM
- Role con M del usuario
- Correo corporativo
- No dejar campos obligatorios vacíos`;
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

    if (t.includes("jira") || t.includes("ticket")) {
  actualizarContexto("jira", txt);
  return generarTicketJira();
}

if (t.includes("comentario") && t.includes("helix")) {
  actualizarContexto("helix", txt);
  return generarComentarioHelix();
}

if (t.includes("escalamiento") || t.includes("escalar")) {
  actualizarContexto("escalamiento", txt);
  return generarEscalamiento();
}

if (t.includes("cierre") || t.includes("cerrar caso")) {
  actualizarContexto("cierre", txt);
  return generarCierre();
}

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

  setGuideActive(false);
  setGuideStep(0);
  setLastAction(detectarIntencion(text));
  setIsTyping(true);

  setChatHistory((prev) => [
    {
      titulo: text.length > 28 ? text.slice(0, 28) + "..." : text,
      proceso: detectarIntencion(text),
      fecha: new Date().toLocaleTimeString()
    },
    ...prev
  ]);

  setMessages((prev) => [
    ...prev,
    { role: "user", text }
  ]);

  setMessage("");

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      { role: "diana", text: respuestaDiana }
    ]);
    setIsTyping(false);
  }, 700);
}
  
  function getGuideSteps() {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const context = lastUserMessage ? normalizar(lastUserMessage.text) : "";

    if (context.includes("teradata")) {
      return [
        "📘 Guía Teradata - Paso 1\n\nConfirma si el usuario ya cuenta con licencia o si será reasignación.\n\nRecuerda: en Teradata ya no hay altas nuevas; solo reasignación.",
        "📘 Guía Teradata - Paso 2\n\nSolicita el Vo.Bo. del usuario que cede la licencia y del N4 del usuario receptor.",
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
    function handleFileUpload(event) {
  const files = Array.from(event.target.files);

  const nuevosArchivos = files.map((file) => ({
    nombre: file.name,
    tipo: file.type,
    tamaño: `${(file.size / 1024).toFixed(1)} KB`,
    url: URL.createObjectURL(file)
  }));

  setUploadedFiles((prev) => [
    ...nuevosArchivos,
    ...prev
  ]);

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
    const links = {
      vpn:
        "https://docs.google.com/presentation/d/1gOInm65Oesu6MtUaAefto_uc2FJsB4H8GF6vZxt_xi4/edit?slide=id.g3356b0b5634_127_70#slide=id.g3356b0b5634_127_70",
      teradata: "https://docs.google.com",
      iam: "https://docs.google.com",
      dml: "https://docs.google.com"
    };

    window.open(links[type], "_blank", "noopener,noreferrer");
  }
  
  function abrirGuiaVisual(tipo) {
  const guias = {
    teradata: {
      titulo: "Alta Usuario Teradata",
      imagen: "/manual-teradata.png",
      descripcion:
        "Aquí debes seleccionar el servicio Alta Usuario Teradata y continuar con los datos del usuario.",
      pasos: [
        "Busca Teradata en el catálogo.",
        "Selecciona Alta Usuario Teradata.",
        "Llena los datos del usuario.",
        "Adjunta Vo.Bo.",
        "Envía la solicitud."
      ]
    },
    vpn: {
      titulo: "Guía VPN",
      imagen: "/manual-vpn.png",
      descripcion:
        "Aquí Diana te guía para revisar error VPN o levantar nueva alta.",
      pasos: [
        "Verifica si ya tienes permiso VPN.",
        "Si tienes error, reinicia el equipo.",
        "Abre Cisco nuevamente.",
        "Si persiste, contacta soporte.",
        "Si es alta nueva, levanta Jira."
      ]
    },
    iam: {
      titulo: "IAM Plataformas",
      imagen: "/manual-iam.png",
      descripcion:
        "Aquí debes clonar la plantilla correcta, no editar la original.",
      pasos: [
        "Ubica la plantilla correcta.",
        "No edites la plantilla original.",
        "Clona la plantilla.",
        "Edita resumen y descripción.",
        "Adjunta evidencia."
      ]
    }
  };

  setVisualGuide(guias[tipo]);
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

  const manuales = [
  {
    nombre: "Manual VPN",
    tipo: "vpn",
    descripcion: "Guía para alta VPN, errores Cisco y soporte.",
    link:
      "https://docs.google.com/presentation/d/1gOInm65Oesu6MtUaAefto_uc2FJsB4H8GF6vZxt_xi4/edit?slide=id.g3356b0b5634_127_70#slide=id.g3356b0b5634_127_70"
  },

  {
    nombre: "Manual Teradata",
    tipo: "teradata",
    descripcion:
      "Proceso de reasignación, VoBo, Jira y Helix.",
    link: "https://docs.google.com"
  },

  {
    nombre: "Manual IAM",
    tipo: "iam",
    descripcion:
      "Plantillas, clonado, accesos y evidencias.",
    link: "https://docs.google.com"
  },

  {
    nombre: "Formato DML",
    tipo: "dml",
    descripcion:
      "Formato para privilegios y roles.",
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
          cursor: "pointer",
          boxShadow: `0 0 20px ${currentTheme.accent}55`
        }}
      >
        ⚙️
      </button>

      {showSettings && (
        <div
          style={{
            position: "fixed",
            top: "84px",
            right: "20px",
            width: "380px",
            maxHeight: "82vh",
            overflowY: "auto",
            zIndex: 998,
            ...styles.card,
            background: "rgba(2,11,22,.98)"
          }}
        >
          <h3 style={{ color: currentTheme.accent }}>Configuración de Diana</h3>

          <label>Color de piel</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginTop: "10px"
            }}
          >
            {Object.entries(avatars).map(([tone, img]) => (
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
                <img
                  src={img}
                  alt={tone}
                  style={{
                    width: "100%",
                    height: "85px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
                {tone}
              </button>
            ))}
          </div>

          <h4 style={styles.cyan}>Tema</h4>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: "#061428",
              color: "white",
              border: `1px solid ${currentTheme.accent}`
            }}
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
              <p style={{ margin: "4px 0", color: "#94a3b8" }}>Copiloto BBVA</p>
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
            
            <div style={{ marginTop: "22px" }}>
              <h3 style={styles.cyan}>🕘 Historial</h3>
              
              {chatHistory.length === 0 ? (
               <p style={{ color: "#94a3b8", fontSize: "13px" }}>
                 Aún no hay conversaciones.
               </p> 
             ) : (
               chatHistory.slice(0, 5).map((item, index) => (
                 <div
                   key={index}
                   style={{
                     ...styles.ghostButton,
                     marginBottom: "8px",
                     fontSize: "12px"
                   }}
                >
                   <strong>{item.titulo}</strong>
                   <br />
                   <span style={{ color: "#94a3b8" }}>
                     {item.proceso} · {item.fecha}
                   </span>
                 </div>
               ))
              )}
            </div>
          </div>
        </aside>

        <main style={styles.main}>
          
          {visualGuide && (
      <div
    style={{
      position: "fixed",
      top: "90px",
      right: "430px",
      width: "520px",
      maxHeight: "82vh",
      overflowY: "auto",
      zIndex: 997,
      ...styles.card,
      background: "rgba(2,11,22,.98)"
    }}
  >
    <button
      onClick={() => setVisualGuide(null)}
      style={{
        float: "right",
        background: "transparent",
        color: "white",
        border: "none",
        fontSize: "22px",
        cursor: "pointer"
      }}
    >
      ×
    </button>

    <h2 style={styles.cyan}>📘 {visualGuide.titulo}</h2>

    <img
      src={visualGuide.imagen}
      alt={visualGuide.titulo}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      style={{
        width: "100%",
        borderRadius: "18px",
        border: `2px solid ${currentTheme.accent}`,
        marginBottom: "16px"
      }}
    />

    <p>{visualGuide.descripcion}</p>

    <h3 style={styles.cyan}>Paso a paso</h3>

    {visualGuide.pasos.map((paso, index) => (
      <div
        key={paso}
        style={{
          marginBottom: "10px",
          padding: "12px",
          borderRadius: "14px",
          background: "#0b2747",
          border: `1px solid ${currentTheme.accent}`
        }}
      >
        <strong>Paso {index + 1}:</strong> {paso}
      </div>
    ))}
  </div>
)}
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
                    Tu asistente inteligente BBVA para procesos, accesos,
                    soporte y generación automática.
                  </p>
                  <div style={{ color: "#86efac" }}>● Diana Online</div>
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
                    
                  {m.role === "diana" && (
                    <button
                      onClick={() => copiarTexto(m.text)}
                      style={{ ...styles.ghostButton, marginTop: "10px" }}
                      >
                      📋 Copiar respuesta
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
              
              {isTyping && (
               <div
                 style={{
                   maxWidth: "260px",
                   padding: "14px 18px",
                   borderRadius: "18px",
                   background: "#031525",
                   border: `1px solid ${currentTheme.accent}`,
                   color: "#cbd5e1"
                 }}
                >
                 🤖 Diana está escribiendo...
               </div>
          )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>

              <label
  style={{
    ...styles.ghostButton,
    display: "inline-block",
    marginBottom: "12px",
    cursor: "pointer"
  }}
>
  📎 Adjuntar documentos

  <input
    type="file"
    multiple
    onChange={handleFileUpload}
    style={{ display: "none" }}
  />
</label>
              
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
              <h3 style={styles.cyan}>🔍 Buscador de manuales</h3>
              
              <input
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                placeholder="Buscar VPN, IAM, Teradata..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "14px",
                  background: "#0b2747",
                  color: "white",
                  border: `1px solid ${currentTheme.accent}`,
                  marginBottom: "12px",
                  boxSizing: "border-box"
                }}
              />
              
              {manualesFiltrados.map((manual) => (
                <button
                  key={manual.nombre}
                  onClick={() => window.open(manual.link, "_blank", "noopener,noreferrer")}
                  style={{ ...styles.ghostButton, marginBottom: "8px", width: "100%" }}
                >
                  <strong>{manual.nombre}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {manual.descripcion}
                  </span>
                </button>
              ))}
            </div>
            
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
                
                <button onClick={() => abrirGuiaVisual("teradata")} style={styles.ghostButton}>
                  🖼️ Ver guía visual Teradata
                </button>
                
                <button onClick={() => abrirGuiaVisual("vpn")} style={styles.ghostButton}>
                  🖼️ Ver guía visual VPN
                </button>
                
                <button onClick={() => abrirGuiaVisual("iam")} style={styles.ghostButton}>
                  🖼️ Ver guía visual IAM
                </button>
                
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
                  style={{
                    ...styles.ghostButton,
                    marginBottom: "8px",
                    width: "100%"
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{ ...styles.card, marginBottom: "18px" }}>
  <h3 style={styles.cyan}>📂 Archivos adjuntos</h3>

  {uploadedFiles.length === 0 ? (
    <p style={{ color: "#94a3b8" }}>
      No hay archivos cargados.
    </p>
  ) : (
    uploadedFiles.map((file, index) => (
      <a
        key={index}
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...styles.ghostButton,
          display: "block",
          marginBottom: "8px",
          textDecoration: "none"
        }}
      >
        <strong>{file.nombre}</strong>

        <br />

        <span
          style={{
            fontSize: "12px",
            color: "#94a3b8"
          }}
        >
          {file.tamaño}
        </span>
      </a>
    ))
  )}
</div>
            <div style={styles.card}>
              <h3 style={styles.cyan}>📊 Estado de servicios</h3>
              
              {Object.entries(serviceStatus).map(([servicio, estado]) => {
                const color =
                  estado === "operativo"
                  ? "#22c55e"
                  : estado === "degradado"
                  ? "#facc15"
                  : "#ef4444";
      
      const icono =
        estado === "operativo"
          ? "🟢"
          : estado === "degradado"
          ? "🟡"
          : "🔴";

    return (
      <div
        key={servicio}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          marginBottom: "8px",
          borderRadius: "12px",
          background: "#0b2747",
          border: `1px solid ${color}`
        }}
      >
        <span style={{ textTransform: "uppercase" }}>{servicio}</span>
        <span style={{ color }}>
          {icono} {estado}
        </span>
      </div>
    );
  })}

  {lastAction && (
    <div
      style={{
        marginTop: "14px",
        padding: "12px",
        borderRadius: "14px",
        background: "rgba(56,189,248,.08)",
        border: `1px solid ${currentTheme.accent}`
      }}
    >
      <strong style={styles.cyan}>Última acción:</strong>
      <br />
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

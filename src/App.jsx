import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function App() {
  const [viewMode, setViewMode] = useState("full");
  const [isTyping, setIsTyping] = useState(false);
  const [visualGuide, setVisualGuide] = useState(null);
  const [visualStep, setVisualStep] = useState(0);
  const [visualQuestion, setVisualQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfText, setPdfText] = useState("");
  const [imageAnalysis, setImageAnalysis] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [skinTone, setSkinTone] = useState("Original");
  const [theme, setTheme] = useState("BBVA Premium");
  const [guideActive, setGuideActive] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [guideType, setGuideType] = useState(null);

  const [serviceStatus] = useState({
    vpn: "operativo",
    iam: "operativo",
    citrix: "degradado",
    teradata: "operativo"
  });

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
      text:
        "Hola 👋 Soy Diana, tu copiloto inteligente BBVA. Estoy aquí para ayudarte con procesos, soporte, accesos, formatos, Jira, Helix, VPN, Citrix, IAM y Teradata."
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
      card: "rgba(8,26,47,.92)",
      sidebar: "#020b16",
      accent: "#38bdf8",
      glow: "#38bdf8",
      text: "white"
    },
    "Oscuro Profesional": {
      bg: "linear-gradient(135deg,#000000,#111827,#1f2937)",
      card: "rgba(15,23,42,.95)",
      sidebar: "#020617",
      accent: "#60a5fa",
      glow: "#60a5fa",
      text: "white"
    },
    "Turquesa Tecnológico": {
      bg: "linear-gradient(135deg,#022c22,#064e3b,#0f766e)",
      card: "rgba(4,120,87,.20)",
      sidebar: "#022c22",
      accent: "#2dd4bf",
      glow: "#2dd4bf",
      text: "white"
    },
    "Púrpura Creativo": {
      bg: "linear-gradient(135deg,#1e032e,#3b0764,#581c87)",
      card: "rgba(88,28,135,.25)",
      sidebar: "#1e032e",
      accent: "#c084fc",
      glow: "#c084fc",
      text: "white"
    },
    Claro: {
      bg: "#f8fafc",
      card: "#ffffff",
      sidebar: "#e2e8f0",
      accent: "#2563eb",
      glow: "#60a5fa",
      text: "#0f172a"
    }
  };

  const currentTheme = themeColors[theme];

  function normalizar(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function copiarTexto(texto) {
    navigator.clipboard.writeText(texto);
    alert("Texto copiado ✅");
  }

  function detectarIntencion(texto) {
    const t = normalizar(texto);

    if (t.includes("teradata") || t.includes("reasignacion")) return "teradata";
    if (t.includes("vpn") || t.includes("cisco") || t.includes("certificate")) return "vpn";
    if (t.includes("citrix") || t.includes("bloqueo")) return "citrix";
    if (t.includes("iam") || t.includes("plantilla")) return "iam";
    if (
      t.includes("dml") ||
      t.includes("formato") ||
      t.includes("privilegios") ||
      t.includes("role")
    )
      return "dml";
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

  function generarCorreosVoBoAmbos() {
    return `📧 Correos Vo.Bo. generados

━━━━━━━━━━━━━━━━━━━━━━
CORREO 1 — Para el usuario
━━━━━━━━━━━━━━━━━━━━━━

Hola, ando tramitando tu alta de Teradata pero necesito el Vo.Bo. de tu jefe directo con la siguiente estructura:

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
-Role: RLARMXP_ENDUSR_MI05779

━━━━━━━━━━━━━━━━━━━━━━
CORREO 2 — Para el jefe / receptor
━━━━━━━━━━━━━━━━━━━━━━

Hola [NOMBRE DEL JEFE], buen día, espero que se encuentren muy bien.

El motivo de este correo es solicitar tu amable Vo.Bo. para levantar las solicitudes de creación de rol en JIRA y posteriormente el alta de usuario en Helix.

Este movimiento es por reasignación:

[Agregar usuario que cede la licencia]
[Agregar usuario receptor]

Quedo atento a tu amable Vo.Bo.

Saludos.`;
  }

  function esSolicitudCorreosAmbos(texto) {
    const t = normalizar(texto);

    return (
      t.includes("genera el de ambos") ||
      t.includes("generame el de ambos") ||
      t.includes("genérame el de ambos") ||
      t.includes("correo de ambos") ||
      t.includes("correos de ambos") ||
      t.includes("ambos vobo") ||
      t.includes("ambos vo.bo") ||
      t.includes("quiero el de ambos")
    );
  }

  function tieneVoBoConfirmado(texto) {
    const t = normalizar(texto);

    return (
      t.includes("ya tengo el vobo") ||
      t.includes("ya tengo el vo.bo") ||
      t.includes("ya tengo ambos") ||
      t.includes("ya tengo el de ambos") ||
      t.includes("ya cuento con ambos") ||
      t.includes("ya los tengo") ||
      t.includes("tengo ambos vobo") ||
      t.includes("tengo ambos vo.bo") ||
      t.includes("tengo el de ambos") ||
      t.includes("ya tengo los dos") ||
      t.includes("ya cuento con los dos")
    );
  }

  function responder(txt) {
    const t = normalizar(txt);
    const intent = detectarIntencion(txt);

    if (
      pdfText &&
      (t.includes("pdf") ||
        t.includes("documento") ||
        t.includes("manual") ||
        t.includes("resume") ||
        t.includes("resumen") ||
        t.includes("que dice"))
    ) {
      return `📄 Revisé el documento cargado.

Esto es lo más relevante que encontré:

${pdfText.substring(0, 1800)}

Si quieres, puedo ayudarte a convertirlo en:
✅ resumen
✅ pasos
✅ checklist
✅ correo
✅ comentario Helix`;
    }

    if (
      imageAnalysis &&
      (t.includes("captura") ||
        t.includes("imagen") ||
        t.includes("pantalla") ||
        t.includes("que ves") ||
        t.includes("que dice") ||
        t.includes("que hago"))
    ) {
      return `🖼️ Analicé la captura.

Esto es lo que encontré:

${imageAnalysis}

Si me indicas qué proceso estás realizando, puedo guiarte paso a paso.`;
    }

    if (tieneVoBoConfirmado(txt)) {
      return `Perfecto 👌

Como ya tienes el Vo.Bo., el siguiente paso es:

1. Adjuntar la evidencia.
2. Crear o actualizar la solicitud en Jira / Helix.
3. Agregar comentario con datos del usuario.
4. Validar que el role y profile sean correctos.
5. Dar seguimiento hasta confirmación.

¿Quieres que te genere el comentario Helix o el ticket Jira?`;
    }

    if (esSolicitudCorreosAmbos(txt)) {
      return generarCorreosVoBoAmbos();
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

VPN es solo conectividad para poder entrar a red interna y después acceder a herramientas como Helix, Jira, Teradata o Citrix.

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
✅ Conectividad / VPN
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

    const userText = text;
    const intent = detectarIntencion(userText);

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setMessage("");
    setVisualQuestion("");

    if (esSolicitudCorreosAmbos(userText)) {
      setIsTyping(true);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "diana",
            text: generarCorreosVoBoAmbos()
          }
        ]);
        setIsTyping(false);
      }, 700);

      return;
    }

    if (guideActive && tieneVoBoConfirmado(userText)) {
      setTimeout(() => {
        nextGuideStep(userText);
      }, 400);
      return;
    }

    if (guideActive) {
      setTimeout(() => {
        nextGuideStep(userText);
      }, 400);
      return;
    }

    const respuestaDiana = responder(userText);

    setLastAction(intent);
    setIsTyping(true);

    setChatHistory((prev) => [
      {
        titulo: userText.length > 28 ? userText.slice(0, 28) + "..." : userText,
        proceso: intent,
        fecha: new Date().toLocaleTimeString()
      },
      ...prev
    ]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "diana", text: respuestaDiana }]);
      setIsTyping(false);
    }, 700);
  }

  function getGuideSteps(type = guideType) {
    if (type === "teradata") {
      return [
        "📘 Guía Teradata - Paso 1\n\nConfirma si el usuario ya cuenta con licencia o si será reasignación.",
        "📘 Guía Teradata - Paso 2\n\nSolicita el Vo.Bo. del usuario que cede la licencia y del N4 del usuario receptor.\n\n¿Ya cuentas con ambos Vo.Bo.?\n\nTambién puedo generarte los correos para ambos.",
        "📘 Guía Teradata - Paso 3\n\nCon los Vo.Bo. listos, genera el correo y comentario Helix.",
        "📘 Guía Teradata - Paso 4\n\nLevanta Jira / Helix y valida acceso por Citrix.",
        "✅ Guía Teradata finalizada."
      ];
    }

    if (type === "vpn") {
      return [
        "🔐 Guía Conectividad / VPN - Paso 1\n\nVPN es solo para conectarte a red interna.",
        "🔐 Guía Conectividad / VPN - Paso 2\n\nReinicia equipo y abre Cisco nuevamente.",
        "🔐 Guía Conectividad / VPN - Paso 3\n\nYa conectado, valida acceso a Helix, Jira, Teradata o Citrix.",
        "🔐 Guía Conectividad / VPN - Paso 4\n\nSi persiste, contacta soporte VPN."
      ];
    }

    if (type === "citrix") {
      return [
        "🖥️ Guía Citrix - Paso 1\n\nConfirma si es bloqueo de usuario o error Citrix.",
        "🖥️ Guía Citrix - Paso 2\n\nReporta al 55 5522 61190.",
        "🖥️ Guía Citrix - Paso 3\n\nValida nuevamente tu acceso."
      ];
    }

    return ["📘 Modo guía activado.\n\nEscríbeme el proceso que necesitas: Teradata, VPN, Citrix, IAM o DML."];
  }

  function startGuide() {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const detected = lastUserMessage ? detectarIntencion(lastUserMessage.text) : "general";
    const selectedGuide = detected === "general" ? "teradata" : detected;
    const steps = getGuideSteps(selectedGuide);

    setGuideType(selectedGuide);
    setGuideActive(true);
    setGuideStep(0);

    setMessages((prev) => [
      ...prev,
      {
        role: "diana",
        text: steps[0],
        guide: true
      }
    ]);
  }

  function nextGuideStep(userAnswer = "") {
    if (esSolicitudCorreosAmbos(userAnswer)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "diana",
          text: generarCorreosVoBoAmbos(),
          guide: true
        }
      ]);

      return;
    }

    const steps = getGuideSteps(guideType);
    const nextStep = guideStep + 1;

    if (nextStep >= steps.length) {
      setGuideActive(false);
      setGuideStep(0);
      setGuideType(null);

      setMessages((prev) => [
        ...prev,
        {
          role: "diana",
          text: "✅ Guía terminada. Ya tienes los pasos principales para continuar."
        }
      ]);

      return;
    }

    setGuideStep(nextStep);

    setMessages((prev) => [
      ...prev,
      {
        role: "diana",
        text:
          userAnswer.trim() !== ""
            ? `Perfecto, tomo en cuenta tu respuesta: "${userAnswer}".\n\n${steps[nextStep]}`
            : steps[nextStep],
        guide: true
      }
    ]);
  }

  function openLink(type) {
    const links = {
      vpn: "citrix-acceso.pdf",
      citrix: "citrix-acceso.pdf",
      teradata: "teradata-alta-usuario.pdf",
      vobo: "VoBo-Teradata.pdf",
      iam: "iam-plantillas.pdf",
      dml: "VoBo-Teradata.pdf",
      jira: "jira-solicitudes.pdf",
      helix: "helix-peticiones.pdf",
      impedimentos: "impedimentos-modelo-atencion-jira.pdf"
    };

    window.open(links[type], "_blank", "noopener,noreferrer");
  }

  async function extraerTextoPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textoCompleto = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const textoPagina = content.items.map((item) => item.str).join(" ");
        textoCompleto += "\n\n" + textoPagina;
      }

      return textoCompleto;
    } catch (error) {
      console.error(error);
      return "No pude leer el PDF.";
    }
  }

  async function leerImagenOCR(file) {
    try {
      const result = await Tesseract.recognize(file, "spa");
      return result.data.text;
    } catch (error) {
      console.error(error);
      return "No pude leer la imagen.";
    }
  }

  function detectarProcesoOCR(textoOCR) {
    const t = normalizar(textoOCR);

    if (t.includes("vpn") || t.includes("cisco") || t.includes("certificate")) return "vpn";
    if (t.includes("citrix") || t.includes("daas") || t.includes("workspace")) return "citrix";
    if (t.includes("jira") || t.includes("issue") || t.includes("ticket")) return "jira";
    if (t.includes("helix") || t.includes("peticion") || t.includes("incidente")) return "helix";
    if (t.includes("iam") || t.includes("plantilla") || t.includes("acceso")) return "iam";
    if (t.includes("teradata") || t.includes("klarmxpu") || t.includes("klarmxpv")) return "teradata";

    return "general";
  }

  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);

    const nuevosArchivos = files.map((file) => ({
      nombre: file.name,
      tipo: file.type,
      tamaño: `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file)
    }));

    setUploadedFiles((prev) => [...nuevosArchivos, ...prev]);

    const pdf = files.find((f) => f.type.includes("pdf"));
    const image = files.find((f) => f.type.includes("image"));

    if (image) {
      const textoImagen = await leerImagenOCR(image);
      const procesoOCR = detectarProcesoOCR(textoImagen);

      setLastAction(procesoOCR);

      setImageAnalysis(`🖼️ Captura detectada:
${image.name}

Proceso detectado:
${procesoOCR.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━

${textoImagen.substring(0, 2000)}

━━━━━━━━━━━━━━━━━━━━━━

Diana puede ayudarte a interpretar esta información.`);

      setMessages((prev) => [
        ...prev,
        {
          role: "diana",
          text: `🖼️ Analicé tu captura.

Detecté posible proceso:
${procesoOCR.toUpperCase()}

Puedes preguntarme:
- ¿Qué dice esta pantalla?
- ¿Qué hago ahora?
- Guíame paso a paso`
        }
      ]);
    }

    if (pdf) {
      const textoPDF = await extraerTextoPDF(pdf);

      setPdfText(`📄 Documento detectado:
${pdf.name}

━━━━━━━━━━━━━━━━━━━━━━

${textoPDF.substring(0, 3000)}

━━━━━━━━━━━━━━━━━━━━━━

Fin de vista previa`);
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

    event.target.value = "";
  }

  function abrirGuiaVisual(tipo) {
    const guias = {
      teradata: {
        titulo: "Alta Usuario Teradata",
        descripcion: "Diana te guía usando el manual PDF de Teradata.",
        pasos: [
          {
            texto: "Revisa el inicio del manual de alta Teradata.",
            pdf: "teradata-alta-usuario.pdf#page=1"
          },
          {
            texto: "Ubica el proceso de solicitud o reasignación.",
            pdf: "teradata-alta-usuario.pdf#page=2"
          },
          {
            texto: "Valida los datos requeridos del usuario.",
            pdf: "teradata-alta-usuario.pdf#page=3"
          },
          {
            texto: "Adjunta Vo.Bo. y continúa con Helix/Jira.",
            pdf: "VoBo-Teradata.pdf#page=1"
          }
        ]
      },
      vpn: {
        titulo: "Conectividad / Citrix",
        descripcion: "VPN es conectividad. Citrix permite acceso a entornos internos.",
        pasos: [
          {
            texto: "Revisa la guía de acceso Citrix DaaS.",
            pdf: "citrix-acceso.pdf#page=1"
          },
          {
            texto: "Sigue los pasos de conexión.",
            pdf: "citrix-acceso.pdf#page=2"
          },
          {
            texto: "Valida errores comunes.",
            pdf: "citrix-acceso.pdf#page=3"
          }
        ]
      },
      iam: {
        titulo: "Guía visual IAM",
        descripcion: "Diana te guía usando el manual de plantillas IAM.",
        pasos: [
          {
            texto: "Revisa las plantillas IAM.",
            pdf: "iam-plantillas.pdf#page=1"
          },
          {
            texto: "Ubica la plantilla correcta.",
            pdf: "iam-plantillas.pdf#page=2"
          },
          {
            texto: "Clona, edita y adjunta evidencia.",
            pdf: "iam-plantillas.pdf#page=3"
          }
        ]
      },
      jira: {
        titulo: "Guía visual Jira",
        descripcion: "Diana te guía usando el manual de solicitudes Jira.",
        pasos: [
          {
            texto: "Revisa cómo levantar una solicitud Jira.",
            pdf: "jira-solicitudes.pdf#page=1"
          },
          {
            texto: "Valida campos obligatorios.",
            pdf: "jira-solicitudes.pdf#page=2"
          }
        ]
      },
      helix: {
        titulo: "Guía visual Helix",
        descripcion: "Diana te guía usando el manual de peticiones Helix.",
        pasos: [
          {
            texto: "Revisa cómo levantar una petición Helix.",
            pdf: "helix-peticiones.pdf#page=1"
          },
          {
            texto: "Agrega comentarios y evidencia.",
            pdf: "helix-peticiones.pdf#page=2"
          }
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

  const knowledgeBase = {
    conectividad: [{ nombre: "Acceso Citrix DaaS", archivo: "citrix-acceso.pdf" }],
    teradata: [
      { nombre: "Alta Usuario", archivo: "teradata-alta-usuario.pdf" },
      { nombre: "Vo.Bo.", archivo: "VoBo-Teradata.pdf" }
    ],
    jira: [
      { nombre: "Solicitudes Jira", archivo: "jira-solicitudes.pdf" },
      { nombre: "Analysis Framework", archivo: "jira-analysis-framework.pdf" }
    ],
    helix: [{ nombre: "Peticiones Helix", archivo: "helix-peticiones.pdf" }],
    iam: [{ nombre: "Plantillas IAM", archivo: "iam-plantillas.pdf" }],
    impedimentos: [{ nombre: "Modelo Atención E2E", archivo: "impedimentos-modelo-atencion-jira.pdf" }]
  };

  const pulseAvatar = {
    animation: "pulseDiana 2.4s infinite ease-in-out"
  };

  const styles = {
    page: {
      minHeight: viewMode === "floating" ? "720px" : "100vh",
      width: viewMode === "floating" ? "460px" : "100%",
      height: viewMode === "floating" ? "720px" : "auto",
      position: viewMode === "floating" ? "fixed" : "relative",
      right: viewMode === "floating" ? "24px" : "auto",
      bottom: viewMode === "floating" ? "24px" : "auto",
      borderRadius: viewMode === "floating" ? "28px" : "0px",
      overflow: "hidden",
      background: currentTheme.bg,
      color: currentTheme.text,
      fontFamily: "Inter, Arial, sans-serif",
      display: "flex",
      zIndex: 900,
      boxShadow: viewMode === "floating" ? `0 0 45px ${currentTheme.accent}55` : "none"
    },
    sidebar: {
      width: "290px",
      background: currentTheme.sidebar,
      borderRight: `1px solid ${currentTheme.accent}`,
      padding: "24px"
    },
    main: {
      flex: 1,
      padding: "

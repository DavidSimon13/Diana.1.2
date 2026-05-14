import React, { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [skinTone, setSkinTone] = useState("Original");
  const [theme, setTheme] = useState("BBVA Premium");
  const [messages, setMessages] = useState([
    {
      role: "diana",
      text:
        "Hola 👋 Soy Diana, tu copiloto inteligente BBVA. Estoy aquí para ayudarte con procesos, soporte, accesos, formatos, Jira, Helix, VPN, Citrix, IAM y Teradata."
    }
  ]);

  const avatar = "/diana-avatar.png";

  function responder(txt) {
    const t = txt.toLowerCase();

    if (t.includes("correo") && t.includes("vobo")) {
      return `📧 Correo Vo.Bo. generado:

Hola [NOMBRE DEL JEFE] buen día, espero que se encuentren muy bien.

El motivo de este correo es solicitar tu amable Vo.Bo. para levantar las solicitudes de creación de rol en JIRA y posteriormente el alta de usuario en Helix.

Estos movimientos son por reasignación:
[Usuario a quien se hará la reasignación]

Saludos.

Datos:
-IP: 150.100.43.100
-Instancia: KLARMXPU/KLARMXPV
-Profile a asignar: PLAOMXP_LUSER
-Role: RLARMXP_ENDUSR_MI05779`;
    }

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
      background: "linear-gradient(135deg,#020817,#061428,#082f49)",
      color: "white",
      fontFamily: "Inter, Arial, sans-serif",
      display: "flex"
    },
    sidebar: {
      width: "290px",
      background: "#020b16",
      borderRight: "1px solid #164e63",
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
      border: "1px solid #164e63",
      borderRadius: "24px",
      padding: "22px",
      boxShadow: "0 0 30px rgba(56,189,248,.12)"
    },
    cyan: {
      color: "#38bdf8"
    },
    button: {
      background: "#38bdf8",
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
      border: "1px solid #164e63",
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
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                objectFit: "cover",
                border: "2px solid #38bdf8"
              }}
            />
            <div>
              <h2 style={{ margin: 0, color: "#38bdf8" }}>Asistente Diana</h2>
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

        <div style={styles.card}>
          <h3 style={{ color: "#38bdf8", marginTop: 0 }}>⚙️ Configuración</h3>

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
              border: "1px solid #164e63"
            }}
          >
            <option>BBVA Premium</option>
            <option>Oscuro Profesional</option>
            <option>Turquesa Tecnológico</option>
            <option>Púrpura Creativo</option>
          </select>

          <label>Color de piel</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginTop: "8px" }}>
            {["Original", "Moreno claro", "Claro"].map((tone) => (
              <button
                key={tone}
                onClick={() => setSkinTone(tone)}
                style={{
                  ...styles.ghostButton,
                  border:
                    skinTone === tone
                      ? "2px solid #38bdf8"
                      : "1px solid #164e63"
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
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #38bdf8",
                  boxShadow: "0 0 35px rgba(56,189,248,.45)"
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
                    border: "1px solid #164e63"
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

                  {m.role === "diana" && (
                    <button style={styles.button}>
                      Da click si deseas que te guíe →
                    </button>
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
                border: "1px solid #164e63",
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
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: "18px" }}>
            <h3 style={styles.cyan}>📌 Generadores</h3>
            {["Correo VoBo", "Comentario Helix", "Historia Jira", "Formato DML", "Plantilla IAM"].map((g) => (
              <div key={g} style={{ ...styles.ghostButton, marginBottom: "8px" }}>
                {g}
              </div>
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

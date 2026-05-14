import React, { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "diana", text: "Hola 👋 Soy Diana, tu copiloto inteligente BBVA." }
  ]);

  function responder(txt) {
    const t = txt.toLowerCase();

    if (t.includes("teradata")) {
      return "⚠️ En Teradata ya no hay altas nuevas. La licencia se obtiene por reasignación con Vo.Bo.";
    }

    if (t.includes("vpn")) {
      return "🔐 Detecté un problema VPN. Reinicia el equipo y abre Cisco nuevamente.";
    }

    if (t.includes("citrix")) {
      return "🖥️ Reporta el bloqueo Citrix al 55 5522 61190.";
    }

    return "Puedo ayudarte con Teradata, VPN, Citrix e IAM.";
  }

  function send(msg = message) {
    if (!msg.trim()) return;

    setMessages(prev => [
      ...prev,
      { role: "user", text: msg },
      { role: "diana", text: responder(msg) }
    ]);

    setMessage("");
  }

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#020817,#061428,#0a2540)",
      color:"white",
      fontFamily:"Arial"
    }}>
      <div style={{padding:"30px"}}>
        <h1 style={{color:"#38bdf8"}}>🤖 Asistente Diana</h1>
        <p>Copiloto inteligente BBVA</p>

        <div style={{
          marginTop:"30px",
          background:"#081a2f",
          border:"1px solid #164e63",
          borderRadius:"20px",
          padding:"25px"
        }}>
          {messages.map((m,idx)=>(
            <div key={idx} style={{
              marginBottom:"20px",
              textAlign:m.role==="user"?"right":"left"
            }}>
              <b style={{color:"#38bdf8"}}>
                {m.role==="user"?"Usuario":"Diana"}
              </b>
              <p>{m.text}</p>
            </div>
          ))}

          <div style={{display:"flex", gap:"10px"}}>
            <input
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{
                flex:1,
                padding:"15px",
                borderRadius:"14px",
                border:"1px solid #164e63",
                background:"#0b2747",
                color:"white"
              }}
            />

            <button
              onClick={()=>send()}
              style={{
                background:"#38bdf8",
                border:"none",
                padding:"15px 20px",
                borderRadius:"14px",
                fontWeight:"bold"
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

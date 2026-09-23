import { useState } from "react";
import "./App.css";
import { TABS } from "./constants";
import RegistroUsuario from "./components/RegistroUsuario";
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import TabPortafolio from "./components/TabPortafolio";
import TabEvaluacion from "./components/TabEvaluacion";
import TabChatbot from "./components/TabChatbot";
import TabDashboard from "./components/TabDashboard";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [tabActiva, setTabActiva] = useState(TABS[0].id);

  if (!usuario) {
    return <RegistroUsuario onIngresar={setUsuario} />;
  }

  return (
    <div className="app-shell">
      <Header usuario={usuario} onCerrarSesion={() => setUsuario(null)} />
      <TabNav tabs={TABS} activa={tabActiva} onChange={setTabActiva} />

      <main className="app-content">
        {tabActiva === "portafolio" && <TabPortafolio />}
        {tabActiva === "evaluacion" && <TabEvaluacion rol={usuario.rol} />}
        {tabActiva === "chatbot" && <TabChatbot rol={usuario.rol} />}
        {tabActiva === "dashboard" && <TabDashboard rol={usuario.rol} />}
      </main>
    </div>
  );
}
